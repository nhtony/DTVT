import { handleAccesControl, handleCors,
    handleBodyRequestParsing,
    handleCompression } from './common';

export default [handleBodyRequestParsing, handleAccesControl,handleCors,handleCompression];