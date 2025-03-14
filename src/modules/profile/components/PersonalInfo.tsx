import { useState, useEffect } from 'react';
import {  useUpdateProfile, ProfileUpdateData } from '../hooks/useProfile';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAtom } from 'jotai';
import { avatarIdAtom } from '../../experience/avatar/state/avatar';

export function PersonalInfo() {
const {profile, loading} = useAuth()
    const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
    const [avatarId] = useAtom(avatarIdAtom);
  
  
  const [formData, setFormData] = useState<ProfileUpdateData>({
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    address: '',
    avatar_url: ''
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
        avatar_url: profile.avatar_url || ''
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
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      // You could add error handling UI here
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-light mb-6">Información personal</h2>
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-white/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  /*
  // Handle error state
  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-light mb-6">Información personal</h2>
        <div className="text-center py-8 text-red-400">
          <p className="mb-2">Error al cargar los datos del perfil</p>
          <p className="text-sm opacity-70">{error instanceof Error ? error.message : 'Se produjo un error desconocido'}</p>
        </div>
      </div>
    );
  }
    */

  // Handle no profile yet
  if (!profile) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-light mb-6">Información personal</h2>
        <div className="text-center py-8 text-gray-400">
          <p>No se encontró información de perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light">Información personal</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm rounded"
            type="button"
          >
            Editar
          </button>
        )}
      </div>

      {/* Profile Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
            {profile.avatar_url ? (
              <img 
                src={`https://models.readyplayer.me/${avatarId}.png`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white/70">
                {profile.first_name?.[0] || profile.username?.[0] || profile.email[0]}
              </span>
            )}
          </div>
          {isEditing && (
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-white/20 hover:bg-white/30 rounded-full p-2"
              onClick={() => {
                // You could implement avatar upload here
                // For simplicity, this just sets a placeholder URL
                setFormData({
                  ...formData,
                  avatar_url: 'https://example.com/placeholder-avatar.jpg'
                });
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm text-gray-400 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm text-gray-400 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm text-gray-400 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={profile.email}
                disabled
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white/70"
              />
              <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede cambiar</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-gray-400 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm text-gray-400 mb-1">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  first_name: profile.first_name || '',
                  last_name: profile.last_name || '',
                  username: profile.username || '',
                  phone: profile.phone || '',
                  address: profile.address || '',
                  avatar_url: profile.avatar_url || ''
                });
                setIsEditing(false);
              }}
              className="px-4 py-2 border border-white/20 text-white/70 hover:text-white rounded"
              disabled={updateProfile.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-white text-black rounded hover:bg-white/90 flex items-center ${
                updateProfile.isPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b border-white/10 pb-3">
              <p className="text-sm text-gray-400">Nombre</p>
              <p>{profile.first_name || 'No especificado'}</p>
            </div>
            <div className="border-b border-white/10 pb-3">
              <p className="text-sm text-gray-400">Apellido</p>
              <p>{profile.last_name || 'No especificado'}</p>
            </div>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400">Nombre de usuario</p>
            <p>{profile.username || 'No especificado'}</p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400">Correo electrónico</p>
            <p>{profile.email}</p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400">Teléfono</p>
            <p>{profile.phone || 'No especificado'}</p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-sm text-gray-400">Dirección</p>
            <p>{profile.address || 'No especificada'}</p>
          </div>
          {profile.updated_at && (
            <div className="text-xs text-gray-500">
              Última actualización: {new Date(profile.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
