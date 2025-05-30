import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserService } from "../services/UserService";
import { User } from "../types/User";

interface PrivateRouteProps {
    children: ReactNode;
    requireNotGuest?: boolean;
}

const PrivateRoute = ({ children, requireNotGuest }: PrivateRouteProps) => {
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                navigate("/login");
                return;
            }

            const userData: User | undefined = await UserService.getById(firebaseUser.uid);

            if (!userData) {
                navigate("/login");
                return;
            }

            if (requireNotGuest && userData.role === "guest") {
                navigate("/");
                return;
            }

            setIsAllowed(true);
        });

        return () => unsubscribe();
    }, [navigate, requireNotGuest]);

    return <>{isAllowed && children}</>;
};

export default PrivateRoute;
