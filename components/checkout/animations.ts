export const animations = {
    slide: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 }
    },
    scale: {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 }
    }
};