/**
 * Static snapshot of intake + care case fields for the scheduling client panel.
 * Values align with the demo client (Vera Jameson) and form copy used in the app.
 */
export const CLIENT_INTAKE_RECORD = {
  displayName: 'Vera Jameson',
  genderLetter: 'M',
  email: 'VeraJameson09@gmail.com',
  /** One of North | East | West | South — matches scheduling quadrants */
  zone: 'North',
  avatarSrc:
    'https://ui-avatars.com/api/?name=Vera+Jameson&size=128&background=f7f7f7&color=0d0d0e&bold=true',
  personal: {
    address: '390, Calgary lane, Washington DC',
    phone: '+1-541-754-3010',
    dateOfBirth: '09/04/64',
    insuranceProvider: 'UnitedHealthcare',
    insuranceNumber: '3J9WH3',
  },
  emergency: {
    name: 'Grace Kameron',
    phone: '+1-930-842-1839',
    address: '12, abc road, alphabet avenue',
    relationship: 'Wife',
  },
  preferences: {
    nurseGender: 'Male',
    language: 'English',
    communication: 'Email and phone',
    livingSituation: 'Lives with spouse and kids',
  },
}
