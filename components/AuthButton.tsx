import { useSession } from "@/context/authContext";
import { router } from "expo-router";
import { Button } from "react-native";

export default function AuthButton({isSignIn = true}: {isSignIn?: boolean}){
    const { signIn, signOut } = useSession();

    const title = isSignIn ? 'Sign in' : 'Sign out';

    const action = () => {
        if(!isSignIn) {
            return signOut();
        }
        return(
            signIn(),
            router.replace('/')
        );
    }

    return(
        <Button title={title} onPress={() => {
            action();
        }}/>
    )

}