import React, { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";
import NProgress from "nprogress";
import getAppLogo from "./Components/SystemSettings/ApplicationLogo";
import { router } from "@inertiajs/react";

const AppInitializer = () => {
    const { auth } = useAuth();

    useEffect(() => {
        const initializeNProgress = async () => {
            const logoUrl = await getAppLogo();
            const themeColor = auth?.sessions?.theme_color;

            NProgress.configure({
                showSpinner: false, 
                minimum: 0.2,
                speed: 300, 
                trickleSpeed: 50,
                template: `
                    <div class="nprogress-modal-overlay z-50">
                        <div class="nprogress-custom-container">
                            <div class="nprogress-circle-loader-wrapper" id="nprogress">
                                <div class="relative  w-16 h-16 md:w-32 md:h-32">
                                    <div 
                                        class="absolute inset-0 border-4 md:border-8 border-cyan-400 border-t-transparent rounded-full animate-spin"
                                    >
                                    </div>
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <img src="/images/others/digits-icon.png" class="w-6 h-6 md:w-14 md:h-14 object-cover"/>
                                    </div>
                                </div>
                                <div class="bar" role="bar" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                `,
            });

            // Attach router events for NProgress
            router.on("start", () => {
                if (!NProgress.isStarted()) {
                    NProgress.start();
                }
            });

            router.on("finish", (event) => {
                if (
                    event.detail.visit.completed ||
                    event.detail.visit.interrupted ||
                    event.detail.visit.cancelled
                ) {
                    NProgress.done();

                    setTimeout(() => {
                        document.querySelector(".nprogress-modal-overlay")?.remove();
                    }, 100);
                }
            });
        };

        initializeNProgress();

        return () => {
            router.on("start", NProgress.start);
            router.on("finish", NProgress.done);
        };
    }, [auth]);

    return null;
};

export default AppInitializer;
