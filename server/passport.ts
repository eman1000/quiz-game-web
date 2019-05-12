import * as passport from "passport";
import * as FacebookTokenStrategy from "passport-facebook-token";

// FACEBOOK STRATEGY
const FacebookTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
    accessToken,
    refreshToken,
    profile,
});

passport.use(new FacebookTokenStrategy({
  clientID: "337440783579454",
  clientSecret: "e39d8a1311e7d2a7e2821e15e62e0e22"
}, FacebookTokenStrategyCallback));

// authenticate function
const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate('facebook-token', { session: false }, (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
    })(req, res);
});

export { authenticateFacebook };