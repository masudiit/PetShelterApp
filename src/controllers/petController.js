const debug = require('debug')('app:petController');
const request = require('request-promise');
const config = require('config');

const mainPath = config.get('ApiServer.Url');

function petController(nav) {
  debug('entered petController');
  debug(nav);


  function isExistsNameAndBreed(nameP, breedP) {
    debug(`isExistsNameAndBreed  ${nameP} ${breedP}`);
    return new Promise((resolve, reject) => {
      const getOptions = {
        method: 'GET',
        uri: `${mainPath}/api/pets/unique/${nameP}/${breedP}`,
        json: true
      };
      request(getOptions)
        .then((response) => {
          debug(` isExistsNameAndBreed Result: ${response.data.case}`);
          const result = response.data.case;
          if (result === '1') {
            debug('isExists: true');
            resolve(true);
          } else {
            debug('isExists: false');
            resolve(false);
          }
        })
        .catch((err) => {
          debug(err);
          debug(err.stack);
          reject(err);
          // return next(err);
        });
    });
  }


  function isValidLocation(latp, lonp) {
    debug(`isValidLocation  ${latp} ${lonp}`);

    return new Promise((resolve, reject) => {
      const getOptions = {
        method: 'GET',
        uri: `${mainPath}/api/services/isvalidloc/${latp}/${lonp}`,
        json: true
      };
      request(getOptions)
        .then((response) => {
          debug(response);
          const result = response.status;

          if (result === 'fail') {
            debug('isLocation: false');
            resolve(false);
          } else {
            debug('isLocation: true');
            resolve(true);
          }
        })
        .catch((err) => {
          debug(`Location ${err}`);
          debug(`Location ${err.stack}`);
          resolve(false);
         // reject(err);
        });
    });
  }


  function getAllPets(req, res, next) {
    debug('controller start getAllPets');
    const getOptions = {
      method: 'GET',
      uri: `${mainPath}/api/pets`,
      json: true
    };
    request(getOptions)
      .then((response) => {
        debug(response);
        res.render('petListView', {
          nav,
          title: 'Does My Pet Need An Umbrella ?',
          pets: response.data
        });
      })
      .catch((err) => {
        debug(err);
        debug(err.stack);
        return next(err);
      });
  }


  function getSinglePet(req, res, next) {
    const pid = req.params.id;
    const getOptions = {
      method: 'GET',
      uri: `${mainPath}/api/pets/${pid}`,
      json: true
    };
    request(getOptions)
      .then((response) => {
        debug(response);
        res.render('petListView', {
          nav,
          title: 'Does My Pet Need An Umbrella ?',
          pets: response.data
        });
      })
      .catch((err) => {
        debug(err);
        debug(err.stack);
        return next(err);
      });
  }


  function performInsertOperation(req, res, next) {
    return new Promise((resolve, reject) => {
      req.body.location = 'n/a';
      const postOptions = {
        method: 'POST',
        uri: `${mainPath}/api/pets/`,
        body: req.body,
        headers: {
          Accept: 'application/json',
          'Accept-Charset': 'utf-8'
        },
        json: true
      };
      request(postOptions)
        .then((response) => {
          debug(`after inser ${response}`);
          res.redirect('/pets');
        })
        .catch((err) => {
          debug(err);
          debug(err.stack);
          reject(err);
          return next(err);
        });
    });
  }

  function checkFormValidation(req, res, next) {
    debug('checkFormValidation');

    req.checkBody('name', 'Name can not be empty.').notEmpty();
    req.checkBody('name', 'Name must be a-zA-Z.').isAlpha();
    req.checkBody('name', 'Name must be min 1 and max 20.').isLength({ min: 1, max: 20});
    req.checkBody('type', 'Type can not be empty.').notEmpty();
    req.checkBody('breed', 'Breed can not be empty.').notEmpty();
    req.checkBody('latitude', 'Latitude can not be empty.').notEmpty();
    req.checkBody('latitude', 'Enter valid latitude.').isDecimal();
    req.checkBody('latitude', 'Latitude must be min 4 and maximum 15').isLength({ min: 4, max: 15});
    req.checkBody('longitude', 'Longitude can not be empty.').notEmpty();
    req.checkBody('longitude', 'Enter valid Longitude.').isDecimal();
    req.checkBody('longitude', 'Longitude must be min 4 and maximum 15').isLength({ min: 4, max: 15});

    const errors = req.validationErrors();

    if (errors) {
      debug(errors);
      try {
        res.render('addPet', {
          nav,
          title: 'Add New Pet',
          errors,
          duplicateErr: '',
          locationErr: '',
          petData: req.body
        });
      } catch (err) {
        debug(err.stack);
        return next(err);
      }
    }

    return true;
  }


  function checkBusinessValidaionAndInsert(req, res, next) {
    const nameP = req.body.name;
    const breedP = req.body.breed;
    const latp = req.body.latitude;
    const lonp = req.body.longitude;

    let isExistsDuplicateNameBusiness = true;
    let isValidLocationBusiness = true;

    isExistsNameAndBreed(nameP, breedP)
      .then((result) => {
        isExistsDuplicateNameBusiness = result;
        debug(`isExistsDuplicateNameBusiness ${isExistsDuplicateNameBusiness}`);
        if (!result) {
          isValidLocation(latp, lonp)
            .then((rst) => {
              isValidLocationBusiness = rst;
              debug(`isValidLocationBusiness ${isValidLocationBusiness}`);
              if (!rst) {
                try {
                  res.render('addPet', {
                    nav,
                    title: 'Add New Pet',
                    errors: {},
                    duplicateErr: '',
                    locationErr: `No valid location found for lat: ${latp} and lon: ${lonp}. \n Please enter latitude between -90 to 90 and longitude between -180 to 180. `,
                    petData: req.body
                  });
                } catch (err) {
                  debug(err.stack);
                  return next(err);
                }
              } else {
                performInsertOperation(req, res, next)
                  .then((rst1) => { debug(rst1); });
              }
            });
        } else {
          try {
            res.render('addPet', {
              nav,
              title: 'Add New Pet',
              errors: {},
              duplicateErr: 'Duplicate data exists for name and breed.',
              locationErr: '',
              petData: req.body
            });
          } catch (err) {
            debug(err.stack);
            return next(err);
          }
        }
      });

    return true;
  }


  function insertPet(req, res, next) {
    debug('inserPet');
    debug(req.body);
    checkFormValidation(req, res, next);
    checkBusinessValidaionAndInsert(req, res, next);
  }

  function updatePet(req, res, next) {
    return next();
  }

  function removePet(req, res, next) {
    return next();
  }


  function addNewPet(req, res, next) {
    try {
      res.render('addPet', {
        nav,
        title: 'Add New Pet',
        errors: {},
        duplicateErr: '',
        locationErr: '',
        petData: req.body
      });
    } catch (err) {
      debug(err.stack);
      return next(err);
    }
    return true;
  }


  function viewPetLocWeather(req, res, next) {
    const latp = req.params.lat;
    const lonp = req.params.lon;
    const pid = req.params.id;
    debug(latp);

    const getOptions = {
      method: 'GET',
      uri: `${mainPath}/api/services/weather/${latp}/${lonp}`,
      json: true
    };
    request(getOptions)
      .then((response) => {
        debug(response);
        res.render('petView', {
          nav,
          title: 'View Pet Location and Weather',
          latp,
          lonp,
          pid,
          weather: response.message,
          icon: response.icon
        });
      })
      .catch((err) => {
        debug(err);
        debug(err.stack);
        return next(err);
      });

    return true;
  }


  return {
    getAllPets,
    getSinglePet,
    insertPet,
    updatePet,
    removePet,
    addNewPet,
    viewPetLocWeather
  };
}


module.exports = petController;

