import ksuid from "ksuid";

export const generateKsuid = (prefix?: string): string => {
  const generatedKsuid = ksuid.randomSync(new Date());
  const idString = generatedKsuid.string;
  if (prefix) {
    return `${prefix}_${idString}`;
  }
  return idString;
};
