import { ChannelType } from '@/types';

export interface ChannelConfig {
  name: string;
  color: string;
  bgColor: string;
  icon: string; // emoji or icon name
  description: string;
}

export const CHANNEL_CONFIGS: Record<ChannelType, ChannelConfig> = {
  instagram: {
    name: 'Instagram',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
    icon: '📷',
    description: 'Instagram Direct Messages',
  },
  whatsapp: {
    name: 'WhatsApp',
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    icon: '💬',
    description: 'WhatsApp Business Messages',
  },
  messenger: {
    name: 'Messenger',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
    icon: '💬',
    description: 'Facebook Messenger',
  },
};

export function getChannelConfig(channel: ChannelType): ChannelConfig {
  return CHANNEL_CONFIGS[channel];
}

export function getChannelName(channel: ChannelType): string {
  return CHANNEL_CONFIGS[channel].name;
}

export function getChannelIcon(channel: ChannelType): string {
  return CHANNEL_CONFIGS[channel].icon;
}

export function getChannelColor(channel: ChannelType): string {
  return CHANNEL_CONFIGS[channel].color;
}

export function formatCustomerHandle(channel: ChannelType, handle: string): string {
  switch (channel) {
    case 'instagram':
      return handle.startsWith('@') ? handle : `@${handle}`;
    case 'whatsapp':
      // Format phone number (this is simplified, you'd want proper intl phone formatting)
      return handle.startsWith('+') ? handle : `+${handle}`;
    case 'messenger':
      return handle; // Messenger uses names
    default:
      return handle;
  }
}
