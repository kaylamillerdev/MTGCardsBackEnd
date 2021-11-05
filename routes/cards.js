import { Router } from 'express';
const router = Router();

import models from '../models';
import cards from models.cards;

import cors from 'cors';
const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200
};

router.get('/all', cors(corsOptions), function (req, res) {
    cards.findAll().then(cardsFound => {
        console.log(cardsFound);
        res.send(cardsFound);
    })
})

router.get('/cards/:id', cors(corsOptions), function (req, res, next){
    let card_id = parseInt(req.params.id);
    cards.findOne({
        where: {CardID: card_id},
    }).then(cardFound => {
        res.send(cardFound);
    })
})

export default router;