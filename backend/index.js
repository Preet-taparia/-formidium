require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

// Sequelize database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Important, as Aiven PostgreSQL requires SSL
    },
  },
});

// Define the Invoice model
const Invoice = sequelize.define('Invoice', {
  recipientAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cryptocurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  companyEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentDue: {
    type: DataTypes.NUMERIC,
    allowNull: false,
  },
  isPending: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default to true as invoices are pending when created
  },
});

// Define the User model
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Sync Database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync({ alter: true }); // Sync models with database
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  port: 587,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

const adminCredentials = {
  email: 'admin@example.com',
  password: 'admin123',
};

// Example endpoint for admin login
app.post('/api/admin-login', (req, res) => {
  const { email, password } = req.body;

  console.log('Admin login attempt:', { email, password });

  // Check if the received credentials match the hardcoded admin credentials
  if (email === adminCredentials.email && password === adminCredentials.password) {
    // Successful login
    console.log('Admin login successful');
    res.status(200).json({ message: 'Admin login successful' });
  } else {
    // Invalid credentials
    console.log('Invalid credentials');
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Route to create a new invoice
app.post('/api/invoices', async (req, res) => {
  const {
    recipientAddress,
    companyName,
    cryptocurrency,
    dueDate,
    description,
    companyEmail,
    invoiceCategory,
    paymentDue
  } = req.body;

  try {
    // Create invoice in database
    const invoice = await Invoice.create({
      recipientAddress,
      companyName,
      cryptocurrency,
      dueDate,
      description,
      companyEmail,
      invoiceCategory,
      paymentDue
    });

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: companyEmail,
      subject: 'Invoice Created',
      text: `An invoice has been created. View it here: http://your-domain.com/invoice/${invoice.id}`,
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email');
    }

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Route to get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Route to get invoices for a specific user
app.get('/user/:recipientAddress/invoices', async (req, res) => {
  const { recipientAddress } = req.params;

  try {
    const invoices = await Invoice.findAll({
      where: {
        recipientAddress: recipientAddress,
      },
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Route to update the payment amount for an invoice
app.put('/invoices/:invoiceId/payment', async (req, res) => {
  const { invoiceId } = req.params;
  const { amountPaid, walletAddress } = req.body;

  try {
    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    if (invoice.recipientAddress !== walletAddress) {
      return res.status(403).json({ error: 'Unauthorized: Wallet address does not match the recipient address' });
    }

    const existingPaymentDue = parseFloat(invoice.paymentDue);
    const paymentAmount = parseFloat(amountPaid);

    if (isNaN(existingPaymentDue) || isNaN(paymentAmount)) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }
    const newPaymentDue = existingPaymentDue - paymentAmount;
    if (newPaymentDue < 0) {
      return res.status(400).json({ error: 'Payment exceeds the amount due' });
    }

    invoice.paymentDue = newPaymentDue.toFixed(4); // fix to 4 places 
    invoice.isPending = newPaymentDue > 0;
    await invoice.save();

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error updating invoice paymentDue:', error);
    res.status(500).json({ error: 'Failed to update invoice paymentDue' });
  }
});

// Route to get pending invoices
app.get('/invoices/pending', async (req, res) => {
  try {
    const pendingInvoices = await Invoice.findAll({
      where: {
        isPending: true
      },
    });
    res.status(200).json(pendingInvoices);
  } catch (error) {
    console.error('Error fetching pending invoices:', error);
    res.status(500).json({ error: 'Failed to fetch pending invoices' });
  }
});

// Route to get completed invoices
app.get('/invoices/completed', async (req, res) => {
  try {
    const completedInvoices = await Invoice.findAll({
      where: {
        isPending: false
      },
    });
    res.status(200).json(completedInvoices);
  } catch (error) {
    console.error('Error fetching completed invoices:', error);
    res.status(500).json({ error: 'Failed to fetch completed invoices' });
  }
});

// Route to generate and send OTP
app.post('/api/generate-otp', async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // Save OTP to the database or update existing
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ email, otp });
    } else {
      user.otp = otp;
      await user.save();
    }

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP for login is: ${otp}`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error generating OTP or sending email:', error);
    res.status(500).json({ error: 'Failed to generate OTP or send email' });
  }
});

// Route to verify OTP and proceed
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and OTP matches
    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Clear OTP after successful verification (optional)
    user.otp = null;
    user.email_verified = true;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});