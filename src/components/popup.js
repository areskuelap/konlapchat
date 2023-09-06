import React, { useState, useEffect } from "react";

function Popup({showIdioma, setShowIdioma, idioma, setIdioma}) {
      
      const changeLanguage = (lan) => {
        setIdioma(lan);
      }


  return (
    <div className="z-10">
        {showIdioma && (
        <div className="fixed h-screen w-screen z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white mx-10 rounded text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-lg w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >

            <ul>
                <li onClick={() => changeLanguage("es")}  className="px-6 mt-9 hover:text-blue-600 text-gray-700 font-semibold">Español (PERÚ)</li>
                <li onClick={() => changeLanguage("en")} className="px-6 py-3 hover:text-blue-600 text-gray-700 font-semibold">English (USA)</li>
            </ul>
            <div className="bg-gray-50 px-4 mt-6 sm:mt-0 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={(e) => setShowIdioma(false)}
            >
              {idioma === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
    
  )}
</div>
)
}

export default Popup;