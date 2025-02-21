
import { Router } from 'express';
import { authenticate } from 'passport';
const router = Router();

router.use(()=>console.log('insideeee called'))
router.get('/google', authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/'); // Redirect to home page after successful authentication
  }
);

export default{ router}