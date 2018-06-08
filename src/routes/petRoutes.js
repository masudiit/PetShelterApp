const express = require('express');

const petRouter = express.Router();
const { petController } = require('../controllers');
const debug = require('debug')('app:petRoutes');


function petRouteFunc(nav) {
  const {
    getAllPets,
    getSinglePet,
    insertPet,
    updatePet,
    removePet,
    addNewPet,
    viewPetLocWeather
  } = petController( nav);

  debug('entered petRoute');


  //--------------------------------------
  // webpage routing calling
  //----------------------------------------
  petRouter.route('/addNewPet').get(addNewPet);
  petRouter.route('/viewPetLocWeather/:id/:lat/:lon').get(viewPetLocWeather);

  //---------------------------------------
  // internal api calling
  //---------------------------------------
  petRouter.route('/').get(getAllPets);
  petRouter.route('/:id').get(getSinglePet);
  petRouter.route('/').post(insertPet);
  petRouter.route('/:id').put(updatePet);
  petRouter.route('/:id').delete(removePet);


  return petRouter;
}

module.exports = petRouteFunc;
