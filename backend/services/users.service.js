import User from '../models/User.js';
import Sale from '../models/Sale.js';
import { HttpError } from '../utils/httpError.js';

export async function listUsers() {
  return User.find().select('-password');
}

export async function getUserById(id) {
  const user = await User.findById(id).select('-password');
  if (!user) throw new HttpError(404, 'Usuario no encontrado');
  return user;
}

export async function registerUser(data) {
  const { name, email, password, phone, address } = data ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    throw new HttpError(400, 'Datos inválidos. Se requieren los campos: name, email, password');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, 'El correo electrónico ya está registrado');
  }

  const newUser = new User({
    name,
    email,
    password,
    phone: phone || '',
    address: address || '',
  });

  await newUser.save();

  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;
  return userWithoutPassword;
}

export async function loginUser(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new HttpError(400, 'El correo electrónico y la contraseña son obligatorios');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, 'Correo electrónico o contraseña inválidos');
  }

  if (!user.active) {
    throw new HttpError(403, 'La cuenta de usuario está inactiva');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Correo electrónico o contraseña inválidos');
  }

  const token = user.generateToken();
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  return { user: userWithoutPassword, token };
}

export async function updateUser(id, data) {
  const { name, email, password, phone, address } = data ?? {};
  const updateData = {};

  if (typeof name === 'string') updateData.name = name;
  if (typeof email === 'string') updateData.email = email;
  if (typeof password === 'string') updateData.password = password;
  if (typeof phone === 'string') updateData.phone = phone;
  if (typeof address === 'string') updateData.address = address;

  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  if (!user) throw new HttpError(404, 'Usuario no encontrado');
  return user;
}

export async function deleteUser(id) {
  const user = await User.findById(id);
  if (!user) throw new HttpError(404, 'Usuario no encontrado');

  const relatedSales = await Sale.find({ userId: id });
  if (relatedSales.length > 0) {
    throw new HttpError(409, 'No se puede eliminar el usuario: tiene ventas asociadas', {
      sales: relatedSales.map((v) => v.id),
    });
  }

  await User.findByIdAndDelete(id);
}
