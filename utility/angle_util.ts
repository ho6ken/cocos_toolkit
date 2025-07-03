import { Vec2, Vec3, v2 } from "cc";

/**
 * 角度工具
 */
export class AngleUtil {
    /**
     * 角度轉弧度
     */
    public static toRadian(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**
     * 弧度轉角度
     */
    public static toAngle(radian: number): number {
        return radian * 180 / Math.PI;
    }

    /**
     * 角度取sin
     */
    public static angleSin(angle: number): number {
        return Math.sin(this.toRadian(angle));
    }

    /**
     * 角度取cos
     */
    public static angleCos(angle: number): number {
        return Math.cos(this.toRadian(angle));
    }

    /**
     * 兩向量取夾角
     */
    public static vecAngle(dir1: Vec2 | Vec3, dir2: Vec2 | Vec3): number {
        return this.toAngle(v2(dir2.x, dir2.y).signAngle(v2(dir1.x, dir1.y)));
    }
}
