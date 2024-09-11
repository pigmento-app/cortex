import { useSession } from "@/context/authContext";
import { Text } from "react-native";

export default function Gallery(){
    const { session: token } = useSession();

    console.log('Token:', token);
    return(
        <Text>Gallery</Text>
    )
}