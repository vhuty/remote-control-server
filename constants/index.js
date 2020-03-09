'use strict';

module.exports = {
    MODEL: {
        DEVICE: 'Device',
        CONTROLLER: 'Controller',
        DEVICE_CONTROLLER: 'DeviceController'
    },

    VIEWS: {
        TAGS: "tags",
        QUESTIONS: "questions",
        QUESTION_DETAIL: "questionDetail",
        TAG_DETAIL: "tagDetail",
        SIGN_IN: 'signIn',
        SIGN_UP: 'signUp',
        PROFILE_ANSWERS: 'profileAnswers',

        PROFILE_QUESTIONS: 'profileQuestions',
        PROFILE_VOTES: 'profileVotes',
        UPDATE_ANSWER: 'updateAnswer',

        PROFILE_VIEW_QUESTIONS: 'profileViewsQuestions',
        PROFILE_VIEW_VOTES: 'profileViewsVotes',
        PROFILE_VIEW_ANSWERS: 'profileViewsAnswers',

        TUTORIAL_BASE: 'tutorialBase',
        TUTORIAL_DETAIL: 'tutorialDetail',
        TUTORIAL_TAG_LIST: 'tutorialTagList', // list of tags
        TUTORIAL_TAG: 'tutorialTag' // list of tutorials by tag
    },

    SORT: {
        SORT_FIELDS: {
            QUESTIOS_LIST: ["viewsCount", "createdAt"]
        },

        DEFAULTS: {
            QUESTIOS_LIST: "viewsCount"
        }
    },

    REG_EXP: {
        ALTERNATE_URL_PARSE: /^\/(pl|ru|de|es|en)(.*)$/g,
        NOT_TAGGED_WITH_NUMBERS: /^(?!(.*)tag)(.*)\d+/g,
        NEW_LINE: /\n/,
        SEMICON: /[;]/,
        COLON: /[:]/,
        COMMA: /[,]/,
        DOT_G: /[.]/,
        TAG_PATTERN_G: /<(.*)>/g,
        STARTS_WITH_LETTERS: /^[a-zA-Zа-яА-Я]/,
        STARTS_WITH_SYMBOLS: /^[:;,\n]/,
        STARTS_WITH_CLOSED_P: /^<\/p>*?>/
    }
};
