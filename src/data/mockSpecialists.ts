export interface MockSpecialist {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Specialist'
  status: 'active' | 'inactive'
  students: number
  capacity: number
  credits: number
  applications: number
}

export const MOCK_SPECIALISTS: MockSpecialist[] = [
  { id: '1',  name: 'Marvellous Posu',       email: 'marvellous@thelixholdings.com',         role: 'Admin',      status: 'active', students: 4,  capacity: 20, credits: 0, applications: 0   },
  { id: '2',  name: 'Adedamola Adawale',      email: 'adewale.adedamola@thelixholdings.com',  role: 'Admin',      status: 'active', students: 1,  capacity: 20, credits: 0, applications: 18  },
  { id: '3',  name: 'Hassan',                 email: 'ajanakuhassan@thelixholdings.com',       role: 'Specialist', status: 'active', students: 0,  capacity: 20, credits: 0, applications: 0   },
  { id: '4',  name: 'Folake Salako',          email: 'folake.salako@thelixholdings.com',       role: 'Admin',      status: 'active', students: 2,  capacity: 20, credits: 0, applications: 154 },
  { id: '5',  name: 'Daniel Jedidiah',        email: 'daniel@thelixholdings.com',              role: 'Admin',      status: 'active', students: 2,  capacity: 20, credits: 0, applications: 91  },
  { id: '6',  name: 'Chizoba Ezeagabu',       email: 'chizobaezeagabu@thelixholdings.com',     role: 'Specialist', status: 'active', students: 2,  capacity: 20, credits: 0, applications: 77  },
  { id: '7',  name: 'Frank Afam',             email: 'frankmartins@thelixholdings.com',        role: 'Specialist', status: 'active', students: 1,  capacity: 20, credits: 0, applications: 38  },
  { id: '8',  name: 'Oluwatosin Egbeyinka',   email: 'oluwatosinegbeyinka@thelixholdings.com', role: 'Specialist', status: 'active', students: 5,  capacity: 20, credits: 0, applications: 312 },
  { id: '9',  name: 'Arinola Abolarin',       email: 'arinolaabolarin@thelixholdings.com',     role: 'Specialist', status: 'active', students: 3,  capacity: 20, credits: 0, applications: 187 },
  { id: '10', name: 'Tunde Adeyemi',          email: 'tunde.adeyemi@thelixholdings.com',       role: 'Specialist', status: 'active', students: 4,  capacity: 20, credits: 0, applications: 256 },
]
