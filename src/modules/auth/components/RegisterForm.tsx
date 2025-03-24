import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { AvatarCreator } from "../../experience/avatar/components/AvatarCreator";
import { useAtom } from "jotai";
import {
  avatarUrlAtom,
  avatarIdAtom,
} from "../../experience/avatar/state/avatar";
import ReactDOM from "react-dom";
import { isValidEmail } from "../../../shared/utils/validations";

interface RegisterFormProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function RegisterForm({ currentStep, onStepChange }: RegisterFormProps) {
  const navigate = useNavigate();
  const {
    signUp,
    checkUsername,
    updateProfile,
    isSigningUp,
    isCheckingUsername,
    isUpdatingProfile,
  } = useAuth();

  const [error, setError] = useState<string | null>(null);

  // Step 1 data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Step 3 data
  const [avatarUrl] = useAtom(avatarUrlAtom);
  const [avatarId] = useAtom(avatarIdAtom);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  // For tracking the user ID when we need to update profile after auth
  const [userId, setUserId] = useState<string | null>(null);
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentStep === 1) {
      // Check if email is valid
      if (!isValidEmail(email)) {
        setError("Por favor ingresa un correo electrónico válido");
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      try {
        checkUsername(username);
        onStepChange(2);
      } catch (err: any) {
        setError(err.message);
      }
    } else if (currentStep === 2) {
      // Register the user with Supabase Auth
      signUp(
        {
          email,
          password,
        },
        {
          onSuccess: (data) => {
            setUserId(data.user?.id || null);
            onStepChange(3);
          },
          onError: (error: any) => {
            setError(error.message || "Error durante el registro");
          },
        }
      );
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!avatarUrl) {
      setError("Por favor, crea tu avatar");
      return;
    }

    if (!userId) {
      setError("ID de usuario no disponible. Por favor, inténtalo de nuevo.");
      return;
    }

    // In the handleCompleteRegistration function, after successful registration:

    updateProfile(
      {
        userId,
        profileData: {
          username,
          first_name: firstName,
          last_name: lastName,
          email: email,
          avatar_url: avatarUrl,
        },
      },
      {
        onSuccess: () => {
          // Instead of directly navigating to the store, show a message about email confirmation
          navigate({
            to: "/login",
            search: { from: "registration-email-confirmation" },
          });
        },
        onError: () => {
          setError(
            "Error al actualizar el perfil. Por favor, inténtalo de nuevo."
          );
        },
      }
    );
  };

  return (
    <form
      onSubmit={currentStep === 3 ? handleCompleteRegistration : handleNextStep}
      className="space-y-4"
    >
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="username"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCheckingUsername}
            className="w-full mt-6 py-2 px-4 bg-white text-black rounded font-medium hover:bg-opacity-90 transition-colors"
          >
            {isCheckingUsername ? "Verificando..." : "Siguiente"}
          </button>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="firstName"
            >
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="lastName"
            >
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded focus:outline-none focus:border-white/50 text-white"
              required
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={() => onStepChange(1)}
              className="w-1/2 py-2 px-4 bg-transparent border border-white/30 text-white rounded hover:bg-white/10 transition-colors"
            >
              Atrás
            </button>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-1/2 py-2 px-4 bg-white text-black rounded font-medium hover:bg-opacity-90 transition-colors"
            >
              {isSigningUp ? "Procesando..." : "Siguiente"}
            </button>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Crea tu avatar</h3>
            <p className="text-sm text-white/70 mb-4">
              Personaliza cómo te verán otros usuarios en la tienda virtual.
            </p>

            {!avatarUrl ? (
              <button
                type="button"
                onClick={() => setShowAvatarCreator(true)}
                className="w-full py-2 px-4 bg-white/10 border border-white/30 text-white rounded hover:bg-white/20 transition-colors"
              >
                Abrir creador de avatar
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-4 p-2 border border-green-500/30 bg-green-500/10 text-green-400 rounded text-sm">
                  Avatar creado exitosamente
                </div>
                <img
                  src={`https://models.readyplayer.me/${avatarId}.png`}
                  alt="Tu avatar"
                  className="w-32 h-32 rounded-full object-cover mb-2 border-2 border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarCreator(true)}
                  className="text-sm text-white/70 hover:text-white underline mt-2"
                >
                  Cambiar avatar
                </button>
              </div>
            )}
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={() => onStepChange(2)}
              className="w-1/2 py-2 px-4 bg-transparent border border-white/30 text-white rounded hover:bg-white/10 transition-colors"
              disabled={isUpdatingProfile}
            >
              Atrás
            </button>

            <button
              type="submit"
              disabled={isUpdatingProfile || !avatarUrl}
              className={`w-1/2 py-2 px-4 ${
                !avatarUrl
                  ? "bg-white/50 cursor-not-allowed"
                  : "bg-white hover:bg-opacity-90"
              } text-black rounded font-medium transition-colors`}
            >
              {isUpdatingProfile ? "Procesando..." : "Completar registro"}
            </button>
          </div>
        </>
      )}

      {/* Avatar Creator Modal */}
      {showAvatarCreator &&
        ReactDOM.createPortal(
          <AvatarCreator onClose={() => setShowAvatarCreator(false)} />,
          document.body
        )}
    </form>
  );
}
