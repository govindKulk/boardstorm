"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import  SignupFormDemo  from "@/components/signup-form-demo";
import SignInForm from "../signin-form";


export default function SingInButton() {

    const [activeForm, setActiveForm] = useState("signup");

  return (
    <div className="    ">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white font-bold flex justify-center ">
          <span className=" text-center transition duration-500">
            Sing in / Sign up.
          </span>

        </ModalTrigger>
        <div
        className="max-w-md"
        >
        <ModalBody
        className=""
        >
          <ModalContent
          className=""
          >

            {
                activeForm === "signup" ? 
            <SignupFormDemo/> :
            <SignInForm/>
            }
            <p className="text-center">{activeForm === "signup" ? 'Already have an account?' : 'Don\' have an account'} <button onClick={() => setActiveForm(prev => prev === 'signup' ? 'login' : 'signup')} className="text-blue-500 font-bold hover:cursor-pointer"> {activeForm === "signup" ? 'Log in' : 'Sign Up' } </button></p>
            

          </ModalContent>
          

        </ModalBody>
        </div>
      </Modal>
    </div>
  );
}

