const { User } = require('../models');
const bcrypt = require('bcryptjs');
const Validator = require('fastest-validator');
const v = new Validator();

// GET - Daftar pengguna (filter by role optional)
exports.getAllUsers = async (req, res) => {
  const { role } = req.query;
  let whereClause = {};
  if (role) whereClause.role = role;

  try {
    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password", "createdAt", "updatedAt", "resetPasswordToken", "resetPasswordExpires"] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

// GET - Pengguna berdasarkan ID
exports.getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt", "resetPasswordToken", "resetPasswordExpires"] }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// POST - Tambah pengguna baru
exports.createUser = async (req, res) => {
  const schema = {
    name: 'string',
    nip: 'string|optional',
    email: 'email',
    password: 'string|min:6',
    role: { type: 'enum', values: ['orang_tua', 'kepala_sekolah', 'wali_kelas', 'admin'] }
  };

  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }

  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (req.body.nip !== undefined && req.body.nip.trim() === '') {
      req.body.nip = null;
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const user = await User.create(req.body);
    res.json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      return res.status(400).json({ message: `${field} already exists.` });
    }

    res.status(500).json({ message: 'Error registering user', error });
  }
};

// PUT - Perbarui data pengguna
exports.updateUser = async (req, res) => {
  const id = req.params.id;

  let user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const schema = {
    name: 'string|optional',
    nip: 'string|optional',
    email: 'email|optional',
    password: 'string|min:6|optional',
    role: { type: 'enum', values: ['orang_tua', 'kepala_sekolah', 'wali_kelas', 'admin'], optional: true }
  };

  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  if (req.body.nip !== undefined && req.body.nip.trim() === '') {
    req.body.nip = null;
  }

  user = await user.update(req.body);
  res.json(user);
};

// DELETE - Hapus pengguna
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.destroy();
  res.json({ message: 'User is deleted' });
};
