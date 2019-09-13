const bandForm = () => {
  const bandFormClass = document.getElementById('Band-form-profile');
  const bandRoleCheck = document.getElementById('profile-form-role2');
  if (bandRoleCheck.checked) {
    bandFormClass.classList.remove('not-shown');
  } else {
    bandFormClass.classList.add('not-shown');
  }
  return true;
};

const establishmentForm = () => {
  const EstablishmentFormClass = document.getElementById('Establishment-form-profile');
  const EstablishmentRoleCheck = document.getElementById('profile-form-role3');
  if (EstablishmentRoleCheck.checked) {
    EstablishmentFormClass.classList.remove('not-shown');
  } else {
    EstablishmentFormClass.classList.add('not-shown');
  }
  return true;
};

// module.exports = {
//   bandForm, establishmentForm,
// };
