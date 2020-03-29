import { handleAccesControl, handleCors,
    handleBodyRequestParsing,
    handleCompression, 
    handleImageUploadPath } from './common';

export default [handleBodyRequestParsing, handleAccesControl, handleCors, handleCompression, handleImageUploadPath];