import * as usersService from '../services/users.service.js';

export async function getAllUsers(req, res, next) {
  try {
    const users = await usersService.listUsers();
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await usersService.registerUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body ?? {};
    const result = await usersService.loginUser(email, password);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
