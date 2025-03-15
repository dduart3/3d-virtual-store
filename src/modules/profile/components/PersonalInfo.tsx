import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { avatarIdAtom } from '../../experience/avatar/state/avatar';
import { useAtom } from 'jotai';

export function PersonalInfo() {
  const { profile, updateProfile, isUpdatingProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarId] = useAtom(avatarIdAtom);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    address: '',
  });

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateProfile({
        userId: profile?.id || '',
        profileData: {
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address: formData.address,
        }
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };
  // Handle loading state
  if (!profile) {
    return (
      <div className="flex justify-center py-8">
        <svg className="animate-spin h-8 w-8 text-white/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-light tracking-[0.1em] uppercase">
          Información personal
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-none tracking-[0.15em] uppercase text-xs font-light transition-all duration-300"
            type="button"
          >
            Editar
          </button>
        )}
      </div>

      {/* Profile Avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {profile.avatar_url ? (
              <img 
                src={`https://models.readyplayer.me/${avatarId}.png`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white/70 font-light">
                {profile.first_name?.[0] || profile.username?.[0] || profile.email[0]}
              </span>
            )}
          </div>

        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm text-gray-400 mb-2 tracking-wider uppercase font-light">
                  Nombre
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/20 rounded-none px-4 py-3 text-white font-light focus:outline-none focus:border-white/40 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm text-gray-400 mb-2 tracking-wider uppercase font-light">
                  Apellido
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/20 rounded-none px-4 py-3 text-white font-light focus:outline-none focus:border-white/40 transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm text-gray-400 mb-2 tracking-wider uppercase font-light">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/20 rounded-none px-4 py-3 text-white font-light focus:outline-none focus:border-white/40 transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2 tracking-wider uppercase font-light">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={profile.email}
                disabled
                className="w-full bg-black/30 border border-white/20 rounded-none px-4 py-3 text-white/50 font-light"
              />
              <p className="text-xs text-gray-500 mt-1 font-light">El correo electrónico no se puede cambiar</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-gray-400 mb-2 tracking-wider uppercase font-light">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/20 rounded-none px-4 py-3 text-white font-light focus:outline-none focus:border-white/40 transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm text-gray-400 mb-2 tracking-wider uppercase font-light">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/20 rounded-none px-4 py-3 text-white font-light focus:outline-none focus:border-white/40 transition-all duration-300"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  first_name: profile.first_name || '',
                  last_name: profile.last_name || '',
                  username: profile.username || '',
                  phone: profile.phone || '',
                  address: profile.address || '',
                });
                setIsEditing(false);
              }}
              className="px-6 py-3 border border-white/20 text-white/80 hover:text-white hover:border-white/40 rounded-none tracking-[0.15em] uppercase text-xs font-light transition-all duration-300"
              disabled={isUpdatingProfile}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-transparent border border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-none tracking-[0.15em] uppercase text-xs font-light transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              disabled={isUpdatingProfile}
            >
              <span className="relative z-10">
                {isUpdatingProfile ? "Guardando..." : "Guardar cambios"}
              </span>
              <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b border-white/10 pb-3">
              <p className="text-sm text-gray-400 mb-1 tracking-wider uppercase font-light">Nombre</p>
              <p className="font-light">{profile.first_name || 'No especificado'}</p>
            </div>
            <div className="border-b border-white/10 pb-3">
              <p className="text-sm text-gray-400 mb-1 tracking-wider uppercase font-light">Apellido</p>
              <p className="font-light">{profile.last_name || 'No especificado'}</p>
            </div>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400 mb-1 tracking-wider uppercase font-light">Nombre de usuario</p>
            <p className="font-light">{profile.username || 'No especificado'}</p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400 mb-1 tracking-wider uppercase font-light">Correo electrónico</p>
            <p className="font-light">{profile.email}</p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400 mb-1 tracking-wider uppercase font-light">Teléfono</p>
            <p className="font-light">{profile.phone || 'No especificado'}</p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400 mb-1 tracking-wider uppercase font-light">Dirección</p>
            <p className="font-light">{profile.address || 'No especificada'}</p>
          </div>
          {profile.updated_at && (
            <div className="text-xs text-gray-500 font-light">
              Última actualización: {new Date(profile.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
