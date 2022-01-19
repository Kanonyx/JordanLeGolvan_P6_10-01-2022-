const Thing = require('../models/thing');
const fs = require('fs');


//Capture et enregistre l'image, analyse la sauce transformée en chaîne de caractères et 
//l'enregistre dans la base de données en définissant correctement son imageUrl. Initialise les likes 
//et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides.
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};




//Renvoie la sauce avec l’_id fourni.
exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};



//Met à jour la sauce avec l'_id fourni. Si une image est téléchargée, elle est capturée et l’imageUrl de la sauce est mise à jour.
//Si aucun fichier n'est fourni,les informations sur la sauce se trouvent directement dans le corps de la requête (req.body.name,
//req.body.heat, etc.).
//Si un fichier est fourni, la sauce transformée en chaîne de caractères se trouve dans req.body.sauce
exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};




//Supprime la sauce avec l'_id fourni.
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};




//Renvoie un tableau de toutes les sauces de la base de données.
exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    } 
  );
};

//Définit le statut « Like » pour l' userId fourni.
exports.likeThing = (req, res) => {
  if (req.body.like === 1) {
    Thing.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId }
      })
      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) {
    Thing.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId }
      })
      .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }))
  } else {
    Thing.findOne({ _id: req.params.id })
      .then(resultat => {
        if (resultat.usersLiked.includes(req.body.userId)) {
          Thing.findOneAndUpdate(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId }
            })
            .then(() => res.status(200).json({ message: 'like retiré !' }))
            .catch(error => res.status(400).json({ error }))
        }
        else if (resultat.usersDisliked.includes(req.body.userId)) {
          Thing.findOneAndUpdate(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }
            })
            .then(() => res.status(200).json({ message: 'dislike retiré !' }))
            .catch(error => res.status(400).json({ error }))
        }
      })
  }
}


