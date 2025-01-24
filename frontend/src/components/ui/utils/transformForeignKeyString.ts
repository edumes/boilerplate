const transformForeignKeyString = (fkString: string): string => {
    const parts = fkString.split('_');
    const fkIndex = parts.indexOf('fk');

    if (fkIndex === -1 || fkIndex === parts.length - 1) {
        throw new Error("A string não contém 'fk' ou não há parte após 'fk'.");
    }

    const keyPart = parts[fkIndex + 1];

    const baseKey = keyPart.endsWith('id') ? keyPart.slice(0, -2) : keyPart;

    const pluralKey = baseKey + 's';

    return pluralKey;
};

export default transformForeignKeyString;
