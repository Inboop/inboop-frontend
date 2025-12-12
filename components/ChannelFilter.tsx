import { Instagram, MessageCircle, Facebook } from 'lucide-react';

interface ChannelFilterProps {
  selected: 'all' | 'instagram' | 'whatsapp' | 'facebook';
  onSelect: (channel: 'all' | 'instagram' | 'whatsapp' | 'facebook') => void;
}

export function ChannelFilter({ selected, onSelect }: ChannelFilterProps) {
  const channels = [
    { id: 'all', label: 'All', icon: null },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' }
  ] as const;

  return (
    <div className="flex gap-2 overflow-x-auto">
      {channels.map((channel) => {
        const Icon = channel.icon;
        const isSelected = selected === channel.id;

        return (
          <button
            key={channel.id}
            onClick={() => onSelect(channel.id as 'all' | 'instagram' | 'whatsapp' | 'facebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all flex-shrink-0 ${
              isSelected
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {Icon && (
              <Icon
                className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : channel.color}`}
              />
            )}
            <span>{channel.label}</span>
          </button>
        );
      })}
    </div>
  );
}
