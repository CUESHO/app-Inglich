import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Coins, Zap, Sparkles, Lock, Clock, Star, Shield } from "lucide-react";
import { useState } from "react";
import RewardAnimation, { RewardType } from "@/components/RewardAnimation";

export default function Shop() {
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState<RewardType>("coins");

  const { data: progressData } = trpc.progress.getMyProgress.useQuery(
    undefined,
    { enabled: !!user }
  );
  const purchaseItem = trpc.shop.purchaseItem.useMutation();

  const translations = {
    en: {
      title: "Power-Up Shop",
      subtitle: "Boost Your Learning Journey",
      yourCoins: "Your Coins",
      backToWorlds: "Back to Worlds",
      purchase: "Purchase",
      confirm: "Confirm Purchase",
      cancel: "Cancel",
      notEnoughCoins: "Not Enough Coins",
      purchaseSuccess: "Purchase Successful!",
      confirmMessage: "Are you sure you want to purchase this item?",
      items: {
        hint: {
          name: "Hint Power-Up",
          description: "Get a helpful hint for any challenging question",
        },
        xp_multiplier_2x: {
          name: "2x XP Boost",
          description: "Double your XP gains for 30 minutes",
        },
        xp_multiplier_3x: {
          name: "3x XP Boost",
          description: "Triple your XP gains for 30 minutes",
        },
        avatar_knight: {
          name: "Knight Avatar",
          description: "Unlock the legendary Knight avatar",
        },
        avatar_wizard: {
          name: "Wizard Avatar",
          description: "Unlock the mystical Wizard avatar",
        },
        world_unlock: {
          name: "World Unlock",
          description: "Unlock the next world early",
        },
        streak_freeze: {
          name: "Streak Freeze",
          description: "Protect your streak for 1 day",
        },
      },
    },
    es: {
      title: "Tienda de Power-Ups",
      subtitle: "Impulsa Tu Viaje de Aprendizaje",
      yourCoins: "Tus Monedas",
      backToWorlds: "Volver a Mundos",
      purchase: "Comprar",
      confirm: "Confirmar Compra",
      cancel: "Cancelar",
      notEnoughCoins: "Monedas Insuficientes",
      purchaseSuccess: "¡Compra Exitosa!",
      confirmMessage: "¿Estás seguro de que quieres comprar este artículo?",
      items: {
        hint: {
          name: "Power-Up de Pista",
          description: "Obtén una pista útil para cualquier pregunta difícil",
        },
        xp_multiplier_2x: {
          name: "Impulso de XP 2x",
          description: "Duplica tus ganancias de XP por 30 minutos",
        },
        xp_multiplier_3x: {
          name: "Impulso de XP 3x",
          description: "Triplica tus ganancias de XP por 30 minutos",
        },
        avatar_knight: {
          name: "Avatar Caballero",
          description: "Desbloquea el legendario avatar de Caballero",
        },
        avatar_wizard: {
          name: "Avatar Mago",
          description: "Desbloquea el místico avatar de Mago",
        },
        world_unlock: {
          name: "Desbloquear Mundo",
          description: "Desbloquea el siguiente mundo anticipadamente",
        },
        streak_freeze: {
          name: "Congelar Racha",
          description: "Protege tu racha por 1 día",
        },
      },
    },
  };

  const t = translations[language];

  const shopItems = [
    {
      id: "hint",
      icon: Sparkles,
      color: "#00D9FF",
      cost: 50,
      type: "hint",
    },
    {
      id: "xp_multiplier_2x",
      icon: Zap,
      color: "#FFD700",
      cost: 100,
      type: "xp_multiplier",
      duration: 30,
      multiplier: 2,
    },
    {
      id: "xp_multiplier_3x",
      icon: Zap,
      color: "#FF6347",
      cost: 200,
      type: "xp_multiplier",
      duration: 30,
      multiplier: 3,
    },
    {
      id: "avatar_knight",
      icon: Shield,
      color: "#B026FF",
      cost: 300,
      type: "avatar",
    },
    {
      id: "avatar_wizard",
      icon: Star,
      color: "#FF00FF",
      cost: 300,
      type: "avatar",
    },
    {
      id: "world_unlock",
      icon: Lock,
      color: "#00FF9F",
      cost: 500,
      type: "world_unlock",
    },
    {
      id: "streak_freeze",
      icon: Clock,
      color: "#00D9FF",
      cost: 150,
      type: "streak_freeze",
    },
  ];

  const handlePurchase = async (item: any) => {
    if (!progressData || progressData.coins < item.cost) {
      return;
    }

    try {
      await purchaseItem.mutateAsync({
        itemId: item.id,
        itemType: item.type,
        coinsCost: item.cost,
      });

      setRewardType("coins");
      setShowReward(true);
      setSelectedItem(null);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center cyber-grid"
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)' }}
      >
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
          style={{ borderColor: '#00D9FF', boxShadow: '0 0 20px #00D9FF' }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen cyber-grid"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-lg border-b"
        style={{
          background: 'rgba(10, 10, 26, 0.9)',
          borderColor: '#00D9FF40',
          boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                style={{
                  color: '#00D9FF',
                  border: '1px solid #00D9FF',
                  boxShadow: '0 0 10px #00D9FF40'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToWorlds}
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2"
                style={{
                  borderColor: '#FFD700',
                  background: 'rgba(255, 215, 0, 0.1)',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                }}
              >
                <Coins className="w-6 h-6" style={{ color: '#FFD700' }} />
                <span className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                  {progressData?.coins || 0}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("en")}
                  style={{
                    background: language === "en" ? '#00D9FF20' : 'transparent',
                    color: language === "en" ? '#00D9FF' : '#666',
                    border: language === "en" ? '1px solid #00D9FF' : 'none'
                  }}
                >
                  🇺🇸
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage("es")}
                  style={{
                    background: language === "es" ? '#FF008020' : 'transparent',
                    color: language === "es" ? '#FF0080' : '#666',
                    border: language === "es" ? '1px solid #FF0080' : 'none'
                  }}
                >
                  🇲🇽
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-6xl font-black mb-4 neon-text"
            style={{ color: '#00D9FF', textShadow: '0 0 20px #00D9FF' }}
          >
            {t.title}
          </h1>
          <p className="text-2xl" style={{ color: '#B026FF' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {shopItems.map((item) => {
            const Icon = item.icon;
            const canAfford = (progressData?.coins || 0) >= item.cost;
            const itemTranslation = t.items[item.id as keyof typeof t.items];

            return (
              <Card
                key={item.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`,
                  borderColor: item.color,
                  boxShadow: `0 0 20px ${item.color}40, inset 0 0 20px ${item.color}10`,
                }}
                onClick={() => canAfford && setSelectedItem(item)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-12 h-12" style={{ color: item.color }} />
                    <Badge
                      style={{
                        background: '#FFD700',
                        color: '#0a0a1a',
                        boxShadow: '0 0 10px #FFD700'
                      }}
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      {item.cost}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl" style={{ color: item.color }}>
                    {itemTranslation.name}
                  </CardTitle>
                  <CardDescription style={{ color: '#B026FF' }}>
                    {itemTranslation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    disabled={!canAfford || purchaseItem.isPending}
                    style={{
                      background: canAfford ? item.color : '#666',
                      color: '#0a0a1a',
                      boxShadow: canAfford ? `0 0 15px ${item.color}` : 'none',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canAfford) setSelectedItem(item);
                    }}
                  >
                    {canAfford ? t.purchase : t.notEnoughCoins}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent
          style={{
            background: 'linear-gradient(135deg, #1a0a2e 0%, #0a1a2e 100%)',
            borderColor: selectedItem?.color || '#00D9FF',
            boxShadow: `0 0 30px ${selectedItem?.color || '#00D9FF'}40`,
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-3xl"
              style={{ color: selectedItem?.color || '#00D9FF' }}
            >
              {t.confirm}
            </DialogTitle>
            <DialogDescription style={{ color: '#B026FF' }}>
              {t.confirmMessage}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                {selectedItem.icon && (
                  <selectedItem.icon
                    className="w-16 h-16"
                    style={{ color: selectedItem.color }}
                  />
                )}
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: selectedItem.color }}>
                    {t.items[selectedItem.id as keyof typeof t.items].name}
                  </h3>
                  <p style={{ color: '#B026FF' }}>
                    {t.items[selectedItem.id as keyof typeof t.items].description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                <Coins className="w-8 h-8" style={{ color: '#FFD700' }} />
                <span style={{ color: '#FFD700' }}>{selectedItem.cost}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedItem(null)}
              style={{ borderColor: '#666', color: '#666' }}
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => selectedItem && handlePurchase(selectedItem)}
              disabled={purchaseItem.isPending}
              style={{
                background: selectedItem?.color || '#00D9FF',
                color: '#0a0a1a',
                boxShadow: `0 0 15px ${selectedItem?.color || '#00D9FF'}`,
              }}
            >
              {t.purchase}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reward Animation */}
      <RewardAnimation
        type={rewardType}
        show={showReward}
        message={t.purchaseSuccess}
        onComplete={() => setShowReward(false)}
      />
    </div>
  );
}
