"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@solana/wallet-adapter-react";
import { Settings, Wallet, Bell, Palette, Database, Download, Upload, Trash2 } from "lucide-react";
import { useCollection } from "@/contexts/CollectionContext";
import { useTheme } from "next-themes";
import { useNotifications } from "@/contexts/NotificationContext";

export default function SettingsContent() {
  const { publicKey, disconnect } = useWallet();
  const { clearCollection } = useCollection();
  const { theme, setTheme } = useTheme();
  const { addNotification } = useNotifications();
  
  const [notifications, setNotifications] = useState({
    newCards: true,
    trades: true,
    packOpenings: true,
    achievements: false,
  });

  const [collection, setCollection] = useState({
    autoSave: true,
    showRarity: true,
    showStats: true,
  });

  const handleExportCollection = () => {
    try {
      const collectionData = localStorage.getItem(`pokemon_collection_${publicKey?.toString()}`);
      if (collectionData) {
        const blob = new Blob([collectionData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pokemon-collection-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addNotification({
          type: "collection",
          title: "Collection Exported",
          message: "Your collection has been exported successfully",
        });
      }
    } catch (error) {
      console.error("Error exporting collection:", error);
    }
  };

  const handleImportCollection = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && publicKey) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            const storageKey = `pokemon_collection_${publicKey.toString()}`;
            localStorage.setItem(storageKey, JSON.stringify(data));
            
            addNotification({
              type: "collection",
              title: "Collection Imported",
              message: `Successfully imported ${data.length} cards to your collection`,
            });
            
            window.location.reload();
          } catch (error) {
            console.error("Error importing collection:", error);
            alert("Invalid collection file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearCollection = () => {
    if (confirm("Are you sure you want to clear your collection? This action cannot be undone.")) {
      clearCollection();
      addNotification({
        type: "collection",
        title: "Collection Cleared",
        message: "Your collection has been cleared",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="wallet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="collection" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Collection
          </TabsTrigger>
        </TabsList>

        {/* Wallet Settings */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Settings</CardTitle>
              <CardDescription>Manage your Solana wallet connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Connected Wallet</Label>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : "Not connected"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {publicKey ? "Phantom Wallet" : "Connect a wallet to get started"}
                    </p>
                  </div>
                  {publicKey && (
                    <Button variant="outline" onClick={disconnect}>
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your wallet address is used to store your collection data locally. 
                  Your private keys are never shared with the application.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme || "light"} onValueChange={(value) => setTheme(value)}>
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between light and dark theme. Changes apply immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-cards">New Cards</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when you receive new cards
                  </p>
                </div>
                <Switch
                  id="new-cards"
                  checked={notifications.newCards}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newCards: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trades">Trades</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified about trade requests and updates
                  </p>
                </div>
                <Switch
                  id="trades"
                  checked={notifications.trades}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, trades: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pack-openings">Pack Openings</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified about pack opening results
                  </p>
                </div>
                <Switch
                  id="pack-openings"
                  checked={notifications.packOpenings}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, packOpenings: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="achievements">Achievements</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when you unlock achievements
                  </p>
                </div>
                <Switch
                  id="achievements"
                  checked={notifications.achievements}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, achievements: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collection Settings */}
        <TabsContent value="collection">
          <Card>
            <CardHeader>
              <CardTitle>Collection Settings</CardTitle>
              <CardDescription>Manage your collection preferences and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically save your collection changes
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={collection.autoSave}
                    onCheckedChange={(checked) =>
                      setCollection({ ...collection, autoSave: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-rarity">Show Rarity</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display card rarity indicators
                    </p>
                  </div>
                  <Switch
                    id="show-rarity"
                    checked={collection.showRarity}
                    onCheckedChange={(checked) =>
                      setCollection({ ...collection, showRarity: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-stats">Show Statistics</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display collection statistics
                    </p>
                  </div>
                  <Switch
                    id="show-stats"
                    checked={collection.showStats}
                    onCheckedChange={(checked) =>
                      setCollection({ ...collection, showStats: checked })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Data Management</h3>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleExportCollection} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Collection
                  </Button>
                  <Button variant="outline" onClick={handleImportCollection} className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Collection
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleClearCollection}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Collection
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Export your collection to backup or transfer to another device. 
                  Import to restore from a backup. Clear will permanently delete your collection data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

