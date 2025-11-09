const API_BASE_URL = '../../api/data';
export async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products.json`);
    if (!response.ok) {
      throw new Error('Error al cargar los productos');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const products = await getProducts();
    return products.find(product => product.id === parseInt(id));
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function getUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users.json`);
    if (!response.ok) {
      throw new Error('Error al cargar los usuarios');
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function validateUser(email, password) {
  try {
    const users = await getUsers();
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const allUsers = [...users, ...registeredUsers];
    const user = allUsers.find(u => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword
      };
    }

    return {
      success: false,
      message: 'Credenciales inválidas'
    };
  } catch (error) {
    console.error('Error validating user:', error);
    return {
      success: false,
      message: 'Error al validar usuario'
    };
  }
}

export async function checkEmailExists(email) {
  try {
    const users = await getUsers();
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const allUsers = [...users, ...registeredUsers];
    
    return allUsers.some(u => u.email === email);
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

export function registerUser(userData) {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const newId = registeredUsers.length > 0 
      ? Math.max(...registeredUsers.map(u => u.id)) + 1 
      : 1000;
    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || '',
      createdAt: new Date().toISOString()
    };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    return {
      success: true,
      user: newUser
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'Error al registrar usuario'
    };
  }
}