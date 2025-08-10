import { createContext, useContext, useState } from "react";

type UserContextType = {
  username: string;
  setUsername: (name: string) => void;
  password: string;
  setPassword: (pass: string) => void;
  profilePicUri: string | null;
  setProfilePicUri: (uri: string | null) => void;
};

const UserContext = createContext<UserContextType>({
  username: "",
  setUsername: () => {},
  password: "",
  setPassword: () => {},
  profilePicUri: null,
  setProfilePicUri: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicUri, setProfilePicUri] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        password,
        setPassword,
        profilePicUri,
        setProfilePicUri,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
