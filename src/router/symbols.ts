const SyNames: { [x: string]: symbol } = {};

SyNames.rootAgenda = Symbol("Root agenda");
SyNames.home = Symbol("Home");
SyNames.login = Symbol("Login");
SyNames.logout = Symbol("Logout");

export default SyNames;
