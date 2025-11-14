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
    const user = users.find(u => u.email === email && u.password === password);

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
    return users.some(u => u.email === email);
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

export async function registerUser(userData) {
  try {
    const users = await getUsers();
    
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      return {
        success: false,
        message: 'El correo electrónico ya está registrado'
      };
    }
    
    const newId = users.length > 0 
      ? Math.max(...users.map(u => u.id)) + 1 
      : 1;
      
    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || '',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
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