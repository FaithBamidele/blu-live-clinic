const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const mongoURI =
  process.env.MONGO_URI ||
  'mongodb://mongodb:27017/liveclinic';

console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'USING DEFAULT');

// --- SCHEMA ---
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin']
  },
  symptoms: {
    type: String,
    default: ''
  },
  age: String,
  location: String,
  diagnosis: {
    type: String,
    default: ''
  },
  prescription: {
    type: String,
    default: ''
  },
  assignedDoctor: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// Optional dedicated health endpoint
app.get('/health', (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    api: 'running',
    database: databaseConnected ? 'connected' : 'disconnected'
  });
});

// --- ROUTES ---
app.post('/api/register', async (req, res) => {
  try {
    const {
      username,
      password,
      phone,
      symptoms,
      age,
      location
    } = req.body;

    const newUser = new User({
      username,
      password,
      phone,
      symptoms,
      age,
      location,
      role: 'patient'
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    const patients = await User.find({
      role: 'patient'
    });

    res.json(patients);
  } catch (err) {
    console.error('PATIENT FETCH ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/assign', async (req, res) => {
  try {
    const { patientId, doctorName } = req.body;

    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      {
        assignedDoctor: doctorName,
        status: 'Assigned'
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json({
      msg: 'Assigned',
      patient: updatedPatient
    });
  } catch (err) {
    console.error('ASSIGN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reset-password', async (req, res) => {
  try {
    const { patientId, newPassword } = req.body;

    const updated = await User.findByIdAndUpdate(
      patientId,
      { password: newPassword },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json({
      msg: 'Password Reset Successful'
    });
  } catch (err) {
    console.error('RESET ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/diagnose', async (req, res) => {
  try {
    const {
      patientId,
      diagnosis,
      prescription
    } = req.body;

    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      {
        diagnosis,
        prescription,
        status: 'Completed'
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json({
      msg: 'Finalized',
      patient: updatedPatient
    });
  } catch (err) {
    console.error('DIAGNOSIS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const deletedPatient = await User.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPatient) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- DATABASE CONNECTION AND SERVER START ---
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
