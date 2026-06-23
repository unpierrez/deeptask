export default {
    common: {
        email: 'E-mail',
        password: 'Password',
        back: 'Back',
        placeholders: {
            email: "you{'@'}company.com",
            password: '••••••••',
            confirmPassword: '••••••••',
            fullName: 'John Smith',
        },
    },

    login: {
        title: 'Welcome back',
        subtitle: 'Sign in with your credentials to continue.',
        forgotPassword: 'Forgot password?',
        orWithEmail: 'or with email',
        keepLoggedIn: 'Remember me',
        continueWithGoogle: 'Google',
        continueWithGitHub: 'GitHub',
        submit: 'Sign in',
        submitting: 'Signing in...',
        noAccount: "Don't have an account?",
        createAccount: 'Create account',
    },

    register: {
        title: 'Create your account',
        subtitle: 'Start organizing your tasks today',
        fullName: 'Full name',
        confirmPassword: 'Confirm password',
        submit: 'Create account',
        submitting: 'Creating account...',
        hasAccount: 'Already have an account?',
        signIn: 'Sign in',
        success: {
            title: 'Account created!',
            message: 'Check your email to activate your account and start organizing your tasks.',
            goToLogin: 'Go to login',
        },
    },

    forgotPassword: {
        title: 'Reset password',
        subtitle: "Enter your email and we'll send you a link to reset your password",
        submit: 'Send recovery link',
        submitting: 'Sending...',
        success: {
            title: 'Email sent!',
            message: 'We sent a link to {email}. Check your inbox and follow the instructions.',
            expiry: 'The link expires in 1 hour.',
            backToLogin: 'Back to login',
        },
    },
}
