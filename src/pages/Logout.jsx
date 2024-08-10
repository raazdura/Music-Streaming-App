import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout());
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        navigate('/');
    });

}

export default Logout;