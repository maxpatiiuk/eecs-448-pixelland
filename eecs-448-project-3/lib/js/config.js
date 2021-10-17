/*
 * Configuration file for board construction
 */

const urlParameters = new URLSearchParams(window.location.search);

const DEBUG = urlParameters.has('debug');
const DEVELOPMENT = DEBUG || urlParameters.has('development');
