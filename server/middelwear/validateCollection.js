
export const validateCollection = (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === "") {

    return res.status(400).json({ 
      error: "Validation failed: Title is required and must be a valid string." 
    });
  }

 
  next();
};