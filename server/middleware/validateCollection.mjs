
const translations = {
    en: {
        error_title: "Validation failed: A collection title is required."
    },
    no: {
        error_title: "Validering feilet: Samlingen må ha en tittel."
    },
    fr: {
        error_title: "Échec de la validation : Un titre de collection est requis."
    }
};

export const validateCollection = (req, res, next) => {
    const { title } = req.body;

  
    const langHeader = req.headers['accept-language'] || 'en';
    const lang = langHeader.startsWith('no') ? 'no' : 'en';

    if (!title || typeof title !== 'string' || title.trim() === "") {

        return res.status(400).json({ 
            error: translations[lang].error_title 
        });
    }

    next();
};