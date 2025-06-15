
export interface TestPatient {
  name: string;
  sex: 'masculino' | 'feminino';
  birthDate: string; // DD/MM/AAAA format
  diagnosis: string;
  specialty?: string;
  expectedDischargeDate: string; // YYYY-MM-DD
  originCity: string;
  isTFD: boolean;
  tfdType?: string;
  department: string;
  admissionDate: string; // YYYY-MM-DD
  admissionTime: string; // HH:MM
}

export const testPatients: TestPatient[] = [
  // CLINICA MEDICA (3 pacientes)
  {
    name: "Maria Silva Santos",
    sex: "feminino",
    birthDate: "15/03/1957",
    diagnosis: "Hipertensão arterial sistêmica descompensada. Paciente apresenta cefaleia intensa e tontura.",
    specialty: "Cardiologia",
    expectedDischargeDate: "2025-06-20",
    originCity: "Belo Horizonte",
    isTFD: false,
    department: "CLINICA MEDICA",
    admissionDate: "2025-06-13",
    admissionTime: "14:30"
  },
  {
    name: "João Carlos Oliveira",
    sex: "masculino", 
    birthDate: "22/09/1979",
    diagnosis: "Diabetes mellitus tipo 2 descompensada com cetoacidose diabética.",
    specialty: "Endocrinologia",
    expectedDischargeDate: "2025-06-22",
    originCity: "Contagem",
    isTFD: true,
    tfdType: "Tratamento de alta complexidade",
    department: "CLINICA MEDICA",
    admissionDate: "2025-06-12",
    admissionTime: "09:15"
  },
  {
    name: "Ana Paula Costa",
    sex: "feminino",
    birthDate: "08/12/1952",
    diagnosis: "Insuficiência cardíaca congestiva classe funcional III. Edema de membros inferiores.",
    specialty: "Cardiologia",
    expectedDischargeDate: "2025-06-25",
    originCity: "Betim",
    isTFD: false,
    department: "CLINICA MEDICA",
    admissionDate: "2025-06-14",
    admissionTime: "16:45"
  },

  // PRONTO SOCORRO (3 pacientes)
  {
    name: "Carlos Roberto Lima",
    sex: "masculino",
    birthDate: "14/07/1986",
    diagnosis: "Pneumonia bacteriana adquirida na comunidade. Febre alta e tosse produtiva.",
    specialty: "Pneumologia",
    expectedDischargeDate: "2025-06-18",
    originCity: "Nova Lima",
    isTFD: false,
    department: "PRONTO SOCORRO",
    admissionDate: "2025-06-15",
    admissionTime: "23:20"
  },
  {
    name: "Francisca Alves",
    sex: "feminino",
    birthDate: "03/04/1969",
    diagnosis: "Crise hipertensiva. PA 200x120mmHg, cefaleia intensa e náuseas.",
    specialty: "Clínica Médica",
    expectedDischargeDate: "2025-06-17",
    originCity: "Sabará",
    isTFD: true,
    tfdType: "Urgência cardiovascular",
    department: "PRONTO SOCORRO",
    admissionDate: "2025-06-15",
    admissionTime: "19:30"
  },
  {
    name: "Pedro Henrique Santos",
    sex: "masculino",
    birthDate: "11/11/1995",
    diagnosis: "Intoxicação alimentar aguda. Vômitos, diarreia e desidratação moderada.",
    specialty: "Gastroenterologia",
    expectedDischargeDate: "2025-06-16",
    originCity: "Ribeirão das Neves",
    isTFD: false,
    department: "PRONTO SOCORRO",
    admissionDate: "2025-06-15",
    admissionTime: "21:45"
  },

  // CLINICA CIRURGICA (3 pacientes - adicionando 1)
  {
    name: "Luiza Fernandes",
    sex: "feminino",
    birthDate: "29/08/1983",
    diagnosis: "Pós-operatório de colecistectomia videolaparoscópica. Colelitíase múltipla.",
    specialty: "Cirurgia Geral",
    expectedDischargeDate: "2025-06-17",
    originCity: "Vespasiano",
    isTFD: false,
    department: "CLINICA CIRURGICA",
    admissionDate: "2025-06-14",
    admissionTime: "07:00"
  },
  {
    name: "Roberto Machado",
    sex: "masculino",
    birthDate: "17/01/1966",
    diagnosis: "Pós-operatório de herniorrafia inguinal bilateral. Hérnia inguinal encarcerada.",
    specialty: "Cirurgia Geral",
    expectedDischargeDate: "2025-06-18",
    originCity: "Santa Luzia",
    isTFD: true,
    tfdType: "Cirurgia eletiva especializada",
    department: "CLINICA CIRURGICA",
    admissionDate: "2025-06-13",
    admissionTime: "06:30"
  },
  {
    name: "Marcela Rodrigues Silva",
    sex: "feminino",
    birthDate: "12/05/1991",
    diagnosis: "Pós-operatório de apendicectomia por videolaparoscopia. Apendicite aguda complicada.",
    specialty: "Cirurgia Geral",
    expectedDischargeDate: "2025-06-19",
    originCity: "Lagoa Santa",
    isTFD: false,
    department: "CLINICA CIRURGICA",
    admissionDate: "2025-06-15",
    admissionTime: "02:30"
  },

  // UTI ADULTO (3 pacientes - adicionando 1)
  {
    name: "Carmen Lúcia Pereira",
    sex: "feminino",
    birthDate: "25/05/1959",
    diagnosis: "Insuficiência respiratória aguda. DPOC exacerbada com necessidade de ventilação mecânica.",
    specialty: "Pneumologia",
    expectedDischargeDate: "2025-06-28",
    originCity: "Lagoa Santa",
    isTFD: true,
    tfdType: "Terapia intensiva",
    department: "UTI ADULTO",
    admissionDate: "2025-06-10",
    admissionTime: "03:15"
  },
  {
    name: "José Antônio Silva",
    sex: "masculino",
    birthDate: "12/10/1954",
    diagnosis: "Sepse grave de foco pulmonar. Choque séptico em uso de drogas vasoativas.",
    specialty: "Medicina Intensiva",
    expectedDischargeDate: "2025-06-30",
    originCity: "Ibirité",
    isTFD: false,
    department: "UTI ADULTO",
    admissionDate: "2025-06-11",
    admissionTime: "18:40"
  },
  {
    name: "Francisco das Chagas Neto",
    sex: "masculino",
    birthDate: "08/03/1948",
    diagnosis: "Infarto agudo do miocárdio com supradesnivelamento do segmento ST. Angioplastia primária realizada.",
    specialty: "Cardiologia",
    expectedDischargeDate: "2025-06-26",
    originCity: "Pedro Leopoldo",
    isTFD: true,
    tfdType: "Cardiologia intervencionista",
    department: "UTI ADULTO",
    admissionDate: "2025-06-12",
    admissionTime: "05:45"
  },

  // PEDIATRIA (3 pacientes - adicionando 1)
  {
    name: "Gabriel Mendes",
    sex: "masculino",
    birthDate: "20/03/2016",
    diagnosis: "Broncopneumonia em criança previamente hígida. Febre há 3 dias e dificuldade respiratória.",
    specialty: "Pediatria",
    expectedDischargeDate: "2025-06-19",
    originCity: "Esmeraldas",
    isTFD: false,
    department: "PEDIATRIA",
    admissionDate: "2025-06-14",
    admissionTime: "11:20"
  },
  {
    name: "Sophia Rodrigues",
    sex: "feminino",
    birthDate: "08/07/2012",
    diagnosis: "Gastroenterite aguda viral. Desidratação leve a moderada, necessitando hidratação venosa.",
    specialty: "Pediatria",
    expectedDischargeDate: "2025-06-17",
    originCity: "Florestal",
    isTFD: true,
    tfdType: "Pediatria especializada",
    department: "PEDIATRIA",
    admissionDate: "2025-06-15",
    admissionTime: "15:10"
  },
  {
    name: "Lucas Eduardo Campos",
    sex: "masculino",
    birthDate: "14/02/2018",
    diagnosis: "Crise convulsiva febril complexa. Primeira crise, necessita investigação neurológica.",
    specialty: "Neurologia Pediátrica",
    expectedDischargeDate: "2025-06-18",
    originCity: "Confins",
    isTFD: false,
    department: "PEDIATRIA",
    admissionDate: "2025-06-15",
    admissionTime: "20:15"
  },

  // UTI NEONATAL (3 pacientes - adicionando 1)
  {
    name: "Miguel Nascimento",
    sex: "masculino",
    birthDate: "01/06/2025",
    diagnosis: "Síndrome do desconforto respiratório do recém-nascido. Prematuridade 34 semanas.",
    specialty: "Neonatologia",
    expectedDischargeDate: "2025-07-15",
    originCity: "Pedro Leopoldo",
    isTFD: true,
    tfdType: "UTI neonatal",
    department: "UTI NEONATAL",
    admissionDate: "2025-06-01",
    admissionTime: "12:45"
  },
  {
    name: "Isabella Santos",
    sex: "feminino",
    birthDate: "26/05/2025",
    diagnosis: "Icterícia neonatal grave. Hiperbilirrubinemia indireta necessitando fototerapia intensiva.",
    specialty: "Neonatologia",
    expectedDischargeDate: "2025-06-20",
    originCity: "Matozinhos",
    isTFD: false,
    department: "UTI NEONATAL",
    admissionDate: "2025-05-28",
    admissionTime: "08:30"
  },
  {
    name: "Arthur Silva Costa",
    sex: "masculino",
    birthDate: "10/06/2025",
    diagnosis: "Cardiopatia congênita complexa. Tetralogia de Fallot, aguardando cirurgia cardíaca.",
    specialty: "Cardiologia Pediátrica",
    expectedDischargeDate: "2025-07-20",
    originCity: "Sete Lagoas",
    isTFD: true,
    tfdType: "Cirurgia cardíaca neonatal",
    department: "UTI NEONATAL",
    admissionDate: "2025-06-10",
    admissionTime: "16:20"
  },

  // MATERNIDADE (3 pacientes - adicionando 2)
  {
    name: "Juliana Cardoso",
    sex: "feminino",
    birthDate: "15/12/1996",
    diagnosis: "Pós-parto cesariana. Gestação a termo, apresentação pélvica, sem intercorrências.",
    specialty: "Obstetrícia",
    expectedDischargeDate: "2025-06-17",
    originCity: "Confins",
    isTFD: false,
    department: "MATERNIDADE",
    admissionDate: "2025-06-14",
    admissionTime: "22:15"
  },
  {
    name: "Camila Aparecida Souza",
    sex: "feminino",
    birthDate: "28/07/1992",
    diagnosis: "Pós-parto normal. Gestação gemelar a termo, parto vaginal sem complicações.",
    specialty: "Obstetrícia",
    expectedDischargeDate: "2025-06-16",
    originCity: "Ibirité",
    isTFD: false,
    department: "MATERNIDADE",
    admissionDate: "2025-06-14",
    admissionTime: "04:45"
  },
  {
    name: "Roberta Cristina Lima",
    sex: "feminino",
    birthDate: "03/09/1989",
    diagnosis: "Pós-parto cesariana eletiva. Cesárea anterior, gestação única a termo.",
    specialty: "Obstetrícia",
    expectedDischargeDate: "2025-06-18",
    originCity: "Esmeraldas",
    isTFD: true,
    tfdType: "Alto risco obstétrico",
    department: "MATERNIDADE",
    admissionDate: "2025-06-15",
    admissionTime: "08:30"
  }
];
