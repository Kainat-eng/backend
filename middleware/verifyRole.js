// middleware/verifyRole.js

export const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRoleName = req.user?.role?.name;

    if (!userRoleName || !allowedRoles.includes(userRoleName)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};
