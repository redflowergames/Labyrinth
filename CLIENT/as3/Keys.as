package as3 {
	
	import flash.events.*;
	
	/***
	 * This static class keeps track of what relevant keys are being pressed.
	 ***/
	public class Keys {
		static var LastBitfield:uint;
		
		public static var Left:Boolean = false;
		public static var Right:Boolean = false;
		static var Jump:Boolean = false;
		static var JumpPrev:Boolean = false;
		
		static var AttackQ:Boolean = false;
		static var AttackQPrev:Boolean = false;
		
		static var AttackW:Boolean = false;
		static var AttackWPrev:Boolean = false;
		
		static var AttackE:Boolean = false;
		static var AttackEPrev:Boolean = false;
		/*
		static var Energy1:Boolean = false;
		static var Energy1Prev:Boolean = false;
		
		static var Energy2:Boolean = false;
		static var Energy2Prev:Boolean = false;
		
		static var Energy3:Boolean = false;
		static var Energy3Prev:Boolean = false;*/
		
		/***
	 	 * This method is called from the event listener function.
		 * The parameters are the KeyboardEvent from the listener, to get the keyCode,
		 * and a boolean which is True if it's a KEY_DOWN event and False for KEY_UP
	 	 ***/
		static function KeyPressed(e:KeyboardEvent, b:Boolean):void{
			//trace(e.keyCode);
			switch(e.keyCode){
				case 37: case 65: // left arrow, a
				Left = b;
				break;
				
				case 39: case 68: // right arrow, d
				Right = b;
				break;
				
				case 32: // space
				Jump = b;
				break;
				
				case 81: case 49: case 73: // q/1/i		// i have 5 attack buttons, what will the other 2 be?
				AttackQ = b;
				break;
				
				case 87: case 50: case 79: // w/2/o
				AttackW = b;
				break;
				
				case 69: case 51: case 80: // e/3/p
				AttackE = b;
				break;
				
				case 27: // ESC
				Main.gsm.SwitchToTitle();
				break;
			}
		}
		
		//Checks whether a specific key is down this frame, but not down last frame.
		static function OnPress(key:String):Boolean{
			switch(key){
				case "AttackQ":
					return (!AttackQPrev && AttackQ);
					break;
				case "AttackW":
					return (!AttackWPrev && AttackW);
					break;
				case "AttackE":
					return (!AttackEPrev && AttackE);
					break;
				case "Jump":
					return (JumpPrev == false && Jump == true);
					break;
			}
				
			return false;
		}
		
		//0QWE PJLR
		static function MakeBitfield():uint {
			//trace("Q: " + OnPress("AttackQ"));
			//trace("W: " + OnPress("AttackW"));
			//trace("E: " + OnPress("AttackE"));
			//trace("Jump: " + OnPress("Jump"));

			var bits:uint = 0;
			if(OnPress("AttackQ")) bits |= 1<<6;
			if(OnPress("AttackW")) bits |= 1<<5;
			if(OnPress("AttackE")) bits |= 1<<4;
			if(OnPress("Jump")) bits |= 1<<3;
			if(Jump) bits |= 1<<2;
			if(Left) bits |= 1<<1;
			if(Right) bits |= 1;
			return bits;
		}
				
		static function Update():void{
			var bits:uint = MakeBitfield();
			if(LastBitfield != bits){
				Main.socket.SendPacketInput(bits);
			}
			LastBitfield = bits;
			JumpPrev = Jump;
			AttackQPrev = AttackQ;
			AttackWPrev = AttackW;
			AttackEPrev = AttackE;
/*			Energy1Prev = Energy1;
			Energy2Prev = Energy2;
			Energy3Prev = Energy3;*/
		}
	}
}
