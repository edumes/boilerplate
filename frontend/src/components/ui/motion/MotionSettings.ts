const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
        },
    },
};

const visible = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
    },
};

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const zoomIn = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: 'easeInOut',
        },
    },
};

const fadeInLeftSidebar = {
    hidden: { opacity: 0, x: -200, y: -57 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 1.8,
            ease: 'easeInOut',
        },
    },
};

const fadeInRightTopbar = {
    hidden: { opacity: 0, x: 1200, y: -57 },
    visible: {
        opacity: 1,
        x: 0,
        y: -57,
        transition: {
            duration: 1.5,
            ease: 'easeInOut',
        },
    },
};

const rotateIn = {
    hidden: { opacity: 0, rotate: -90 },
    visible: {
        opacity: 1,
        rotate: 0,
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
        },
    },
};

export {
    container,
    fadeInLeft,
    fadeInLeftSidebar,
    fadeInRightTopbar,
    item,
    rotateIn,
    visible,
    zoomIn,
};
