const mongoose = require('mongoose');
const url = require("url");


let UserSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        allowNull: false,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
        allowNull: false
    },
    firstName: {
        type: 'string',
        required: true,
        allowNull: false
    },
    lastName: {
        type: 'string',
        required: true,
        allowNull: false
    },
    email: {
        type: 'string',
        required: true,
        allowNull: false,
        unique: true
    },
    token: {
        type: 'string',
        allowNull: true
    },
    cardsOwned: [
        {
            name: {
                type: 'string',
                required: [true, 'Give your card a name!'],
                allowNull: false
            },
            type: {
                type: 'string',
                required: [true, 'Every card has a type!'],
                allowNull: false,
                enum: {
                    values: [
                        'Artifact', 'Creature', 'Enchantment',
                        'Instant', 'Land', 'Legendary',
                        'Planeswalker', 'Sorcery', 'Artifact Creature'
                    ],
                    message: '{VALUE} is not supported. It must be one of the following:   ' +
                        '\'Artifact\', \'Creature\', \'Enchantment\', \n' +
                        '\'Instant\', \'Land\', \'Legendary\', \n' +
                        '\'Planeswalker\', \'Sorcery\''
                }
            },
            'color(s)': {
                type: [String],
                required: [true, 'All cards have a color except lands. Those can be denoted with a null value'],
                allowNull: true,
                enum: {
                    values: [null, 'Colorless', 'Black', 'Blue', 'Green', 'Red', 'White'],
                    message: '{VALUE} is not a valid color. Valid colors are: ' +
                        ' null, Colorless, Black, Blue, Green, Red, White.'
                }
            },
            CMC: {
                type: 'number',
                allowNull: false,
                min: [0, 'Must be a positive number, got {VALUE}'],
                max: [16, 'Must be 16 or lower, got {VALUE}']
            },
            power: {
                type: 'number',
                allowNull: false,
                min: [0, 'Must be a positive number, got {VALUE}'],
                max: [16, 'Must be 16 or lower, got {VALUE}']
            },
            toughness: {
                type: 'number',
                allowNull: false,
                min: [0, 'Must be a positive number, got {VALUE}'],
                max: [16, 'Must be 16 or lower, got {VALUE}']
            },
            rarity: {
                type: 'string',
                allowNull: false,
                required: true,
                enum: {
                    values: ['Mythic', 'Rare', 'Uncommon', 'Common', 'Promo', 'Land', 'Token', 'Special'],
                    message: '{VALUE} is not a valid rarity. Valid rarities are: ' +
                    'Mythic, Rare, Uncommon, Common, Promo, Land, Token, Special. '
                }
            },
            setName: {
                type: 'string',
                required: true,
                enum: {
                    values: [
                        'Commander 2019',
                        'Fate Reforged',
                        'Theros Beyond Death',
                        'Theros',
                        'Apocalypse',
                        'Commander 2017',
                        'Strixhaven: Mystical Archives',
                        'Modern Horizons 2',
                        'Fifth Edition',
                        'Commander 2016',
                        'Time Spiral',
                        'Future Sight',
                        'Gatecrash',
                        'From the Vault: Exiled',
                        'Alliances',
                        'Shards of Alara',
                        'Core Set 2019',
                        'Portal Second Age'
                    ],
                    message: ' \n {VALUE} is not a valid set name. '
                }
            },
            printing: {
                type: "string",
                required: true,
                enum: {
                    values: ['Foil', 'Normal'],
                    message: '{VALUE} must be either Foil or Normal. '
                }
            },
            description: {
                type: 'string',
                required: false
            },
            numOwned: {
                type: 'number',
                default: 0,
                min: [0, '{VALUE} is not 0 or greater. ']
            },
            image: {
                type: 'string',
                required: false
            }
        }
    ]
});

UserSchema.method("toJSON", function(){
    const{ _v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}