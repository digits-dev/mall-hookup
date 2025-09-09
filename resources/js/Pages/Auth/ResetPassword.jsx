import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import getAppName from "../../Components/SystemSettings/ApplicationName";
import getAppLogo from "../../Components/SystemSettings/ApplicationLogo";
import LoginDetails from "../../Components/SystemSettings/LoginDetails";
import LoginInput from "../../Components/Forms/LoginInput";
const ResetPassword = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/send_resetpass_email", {
            onSuccess: () => {
                reset();
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                });
                Toast.fire({
                    icon: "success",
                    title: "Email sent, Please check your email",
                }).then(() => {
                    router.visit("/login");
                });
            },
        });
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="flex flex-col items-center p-5 justify-center w-screen h-screen font-poppins ">
                <img
                    className="w-full h-full absolute"
                    src="/images/login-page/login-bg.jpg"
                />
                <img
                    className="w-12 h-12 md:w-16 md:h-16 mb-3 z-50"
                    src="/images/others/digits-icon.png"
                />
                <p className="text-white text-md md:text-xl font-semibold z-50">
                    MALL HOOKUP
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col m-5 items-center z-50 bg-white/20 w-full border border-white/40 rounded-xl shadow-lg p-6 max-w-md"
                >
                    <p className="text-white text-xl md:text-2xl font-semibold my-4">
                        Forgot Password
                    </p>
                    <p className="text-red-300 text-xs md:text-sm w-full">
                        *will send instructions by your email
                    </p>
                    <LoginInput
                        addMainClass="mt-2"
                        placeholder="Enter your Email"
                        title="Email"
                        name="email"
                        type="text"
                        onError={errors.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <button
                        className={`w-full font-open-sans bg-login-btn-color mt-4 text-white p-2 text-xs cursor-pointer rounded-lg text-center font-medium hover:opacity-70 md:text-base md:p-2.5 disabled:cursor-not-allowed `}
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? "Please Wait" : "Send Email"}
                    </button>
                    <p className="text-xs md:text-sm mt-5 text-white ">
                        <span>Already know the password?</span>{" "}
                        <Link
                            href="login"
                            className="text-login-btn-color2 font-semibold hover:opacity-70"
                        >
                            Back to Login
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default ResetPassword;
