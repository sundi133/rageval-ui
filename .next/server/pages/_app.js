"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clerk/nextjs */ \"@clerk/nextjs\");\n/* harmony import */ var _clerk_nextjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_clerk_nextjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const fetchUser = async ()=>{\n            try {\n                const response = await fetch(\"/api/user\", {\n                    method: \"GET\",\n                    headers: {\n                        \"Content-Type\": \"application/json\"\n                    }\n                });\n                if (response.ok) {\n                    const data = await response.json();\n                    setUser(data);\n                }\n            } catch (error) {\n                console.error(\"Error fetching user:\", error);\n            }\n        };\n        fetchUser();\n    }, []);\n    if (!user) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"p-4 text-center\",\n            children: \"Loading...\"\n        }, void 0, false, {\n            fileName: \"/Users/jyotirmoysundi/git/openeval-ui/pages/_app.tsx\",\n            lineNumber: 48,\n            columnNumber: 12\n        }, this);\n    }\n    if (!user.orgId) {\n        // Redirect to the create organization page or show an appropriate message\n        router.push(\"/create-organization\");\n        return null; // You can also render a loading spinner here\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_clerk_nextjs__WEBPACK_IMPORTED_MODULE_1__.ClerkProvider, {\n        ...pageProps,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/jyotirmoysundi/git/openeval-ui/pages/_app.tsx\",\n            lineNumber: 59,\n            columnNumber: 5\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/jyotirmoysundi/git/openeval-ui/pages/_app.tsx\",\n        lineNumber: 58,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBTXlCO0FBRXFCO0FBQ0o7QUFVMUMsU0FBU0ksTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUUvQyxNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR04sK0NBQVFBLENBQWM7SUFDOUMsTUFBTU8sU0FBU04sc0RBQVNBO0lBRXhCRixnREFBU0EsQ0FBQztRQUNSLE1BQU1TLFlBQVk7WUFDaEIsSUFBSTtnQkFDRixNQUFNQyxXQUFXLE1BQU1DLE1BQU0sYUFBYTtvQkFDeENDLFFBQVE7b0JBQ1JDLFNBQVM7d0JBQ1AsZ0JBQWdCO29CQUNsQjtnQkFDRjtnQkFFQSxJQUFJSCxTQUFTSSxFQUFFLEVBQUU7b0JBQ2YsTUFBTUMsT0FBTyxNQUFNTCxTQUFTTSxJQUFJO29CQUNoQ1QsUUFBUVE7Z0JBQ1Y7WUFDRixFQUFFLE9BQU9FLE9BQU87Z0JBQ2RDLFFBQVFELEtBQUssQ0FBQyx3QkFBd0JBO1lBQ3hDO1FBQ0Y7UUFFQVI7SUFDRixHQUFHLEVBQUU7SUFFTCxJQUFJLENBQUNILE1BQU07UUFDVCxxQkFBTyw4REFBQ2E7WUFBSUMsV0FBVTtzQkFBa0I7Ozs7OztJQUMxQztJQUVBLElBQUksQ0FBQ2QsS0FBS2UsS0FBSyxFQUFFO1FBQ2YsMEVBQTBFO1FBQzFFYixPQUFPYyxJQUFJLENBQUM7UUFDWixPQUFPLE1BQU0sNkNBQTZDO0lBQzVEO0lBRUEscUJBQ0UsOERBQUN2Qix3REFBYUE7UUFBRSxHQUFHTSxTQUFTO2tCQUM1Qiw0RUFBQ0Q7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc1QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENsZXJrTG9hZGVkLFxuICAgIENsZXJrUHJvdmlkZXIsXG4gICAgU2lnbmVkSW4sXG4gICAgU2lnbmVkT3V0LFxuICAgIFJlZGlyZWN0VG9TaWduSW5cbiAgfSBmcm9tICdAY2xlcmsvbmV4dGpzJztcbiAgaW1wb3J0IHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG4gIGltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG4gIGltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcbiAgXG4gIGludGVyZmFjZSBVc2VyIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZW1haWw6IHN0cmluZztcbiAgICBvcmdJZDogc3RyaW5nO1xuICAgIG9yZ1JvbGU6IHN0cmluZztcbiAgICBvcmdTbHVnOiBzdHJpbmc7XG4gIH1cbiAgXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG5cbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8VXNlciB8IG51bGw+KG51bGwpO1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZldGNoVXNlciA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvdXNlcicsIHtcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgc2V0VXNlcihkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgdXNlcjonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZldGNoVXNlcigpO1xuICB9LCBbXSk7XG5cbiAgaWYgKCF1c2VyKSB7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicC00IHRleHQtY2VudGVyXCI+TG9hZGluZy4uLjwvZGl2PjtcbiAgfVxuXG4gIGlmICghdXNlci5vcmdJZCkge1xuICAgIC8vIFJlZGlyZWN0IHRvIHRoZSBjcmVhdGUgb3JnYW5pemF0aW9uIHBhZ2Ugb3Igc2hvdyBhbiBhcHByb3ByaWF0ZSBtZXNzYWdlXG4gICAgcm91dGVyLnB1c2goJy9jcmVhdGUtb3JnYW5pemF0aW9uJyk7XG4gICAgcmV0dXJuIG51bGw7IC8vIFlvdSBjYW4gYWxzbyByZW5kZXIgYSBsb2FkaW5nIHNwaW5uZXIgaGVyZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Q2xlcmtQcm92aWRlciB7Li4ucGFnZVByb3BzfT5cbiAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9DbGVya1Byb3ZpZGVyPlxuICApO1xufVxuIFxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7Il0sIm5hbWVzIjpbIkNsZXJrUHJvdmlkZXIiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsInVzZVJvdXRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwidXNlciIsInNldFVzZXIiLCJyb3V0ZXIiLCJmZXRjaFVzZXIiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiaGVhZGVycyIsIm9rIiwiZGF0YSIsImpzb24iLCJlcnJvciIsImNvbnNvbGUiLCJkaXYiLCJjbGFzc05hbWUiLCJvcmdJZCIsInB1c2giXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "@clerk/nextjs":
/*!********************************!*\
  !*** external "@clerk/nextjs" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@clerk/nextjs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();