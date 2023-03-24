import { joinVoiceChannel,entersState,VoiceConnectionStatus } from "@discordjs/voice"
import {
	GatewayDispatchEvents,
	GatewayVoiceServerUpdateDispatchData,
	GatewayVoiceStateUpdateDispatchData,
} from 'discord-api-types/v10';
import { Snowflake, Client, Guild, VoiceBasedChannel,  Status } from 'discord.js';
import type { DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods } from '@discordjs/voice';

const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
const trackedClients = new Set<Client>();
const trackedShards = new Map<number, Set<Snowflake>>();

class VoiceChannel {

    async connectToChannel(channel: VoiceBasedChannel){
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: this._createDiscordJSAdapter(channel),
        })
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            return connection;

        } catch (error) {
            connection.destroy();
            throw error;
        }
    }
    
    private _createDiscordJSAdapter(channel: VoiceBasedChannel): DiscordGatewayAdapterCreator {
        return (methods) => {
            adapters.set(channel.guild.id, methods);
            this._trackClient(channel.client);
            this._trackGuild(channel.guild);
            return {
                sendPayload(data) {
                    if (channel.guild.shard.status === Status.Ready) {
                        channel.guild.shard.send(data);
                        return true;
                    }
                    return false;
                },
                destroy() {
                    return adapters.delete(channel.guild.id);
                },
            };
        };
    }
    private _trackClient(client: Client) {
        if (trackedClients.has(client)) return;
        trackedClients.add(client);
        client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (payload: GatewayVoiceServerUpdateDispatchData) => {
            adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
        });
        client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (payload: GatewayVoiceStateUpdateDispatchData) => {
            if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
                adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
            }
        });
        client.on('shardDisconnect', (_, shardId) => {
            const guilds = trackedShards.get(shardId);
            if (guilds) {
                for (const guildID of guilds.values()) {
                    adapters.get(guildID)?.destroy();
                }
            }
            trackedShards.delete(shardId);
        });
    }
    
    private _trackGuild(guild: Guild) {
        let guilds = trackedShards.get(guild.shardId);
        if (!guilds) {
            guilds = new Set();
            trackedShards.set(guild.shardId, guilds);
        }
        guilds.add(guild.id);
    }
}

export default VoiceChannel

