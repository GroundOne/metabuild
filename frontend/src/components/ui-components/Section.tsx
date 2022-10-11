const Section: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return <section className="relative mx-auto max-w-7xl px-4 sm:px-6">{children}</section>;
};

export default Section;
