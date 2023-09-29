const jge = {
    l: function()
    {
        let output = [];
        for (i=0; i < arguments.length; i++) output.push(arguments[i])
        window.console.log(output);
    },
    math:
    {
        CARTESIAN_2D_COORDINATE: class { constructor(x_, y_) { this.x = x_; this.y = y_; } },
        POLAR_2D_COORDINATE: class { constructor(a_, r_) { this.a = a_; this.r = r_; } },
        DegreeToRadian: function(degree_) { return degree_ * Math.PI / 180; },
        RadianToDegree: function(radian_) { return radian_ * 180 / Math.PI; },
        Clamp: function(input_, min_, max_)
        {
            if (input_ < min_) return min_;
            else if (input_ > max_) return max_;
            else return input_;
        },
        CartesianToPolar: function(cartesian_, polar_)
        {
            let a = 0;
            if (cartesian_.x>0) a=Math.atan(cartesian_.y/cartesian_.x);
            else if (cartesian_.x<0&&cartesian_.y>=0) a=Math.PI+Math.atan(cartesian_.y/cartesian_.x);
            else if (cartesian_.x<0&&cartesian_.y<0) a=-Math.PI+Math.atan(cartesian_.y/cartesian_.x);
            else if (cartesian_.x===0&&cartesian_.y>0) a=Math.PI/2;
            else if (cartesian_.x===0&&cartesian_.y<0) a=-Math.PI/2;
            if (a < 0) a+=2*Math.PI;
            
            polar_.a = a;
            polar_.r = Math.sqrt(cartesian_.x*cartesian_.x+cartesian_.y*cartesian_.y);
        },
        PolarToCartesian: function(polar_, cartesian_)
        {
            cartesian_.x = Math.cos(polar_.a)*polar_.r;
            cartesian_.y = Math.sin(polar_.a)*polar_.r;
        }
    },
    input:
    {
        KEY_BUFFER: class
        {
            constructor()
            {
                this.buffer = [];
                let buffer = this.buffer
                document.addEventListener('keydown', function(event_) { if (!buffer.includes(event_.key)) buffer.push(event_.key); });
                document.addEventListener('keyup', function(event_) { if (buffer.includes(event_.key)) buffer.splice(buffer.indexOf(event_.key), 1); });
            }
            IsKeyDown = function()
            {
            
                for (i=0; i < arguments.length; i++)
                {
                    if (!this.buffer.includes(arguments[i])) return false;
                }
                return true;
            }
            IsAnyKeyDown = function()
            {
            return this.buffer.length != 0;
            }
            IsKeyUp = function()
            {
                for (i=0; i < arguments.length; i++)
                {
                    if (this.buffer.includes(arguments[i])) return false;
                }
                return true;
            }
            IsAllKeysUp = function()
            {
                return this.buffer.length == 0;
            }
        },
        BUTTON: class
        {
            constructor()
            {
                this.down = false;
            }
        },
        JOY_STICK: class
        {
            #cartesian = new jge.math.CARTESIAN_2D_COORDINATE(0,0);
            #polar = new jge.math.POLAR_2D_COORDINATE(0,0);
            #left = false; #down = false; #right = false; #up = false;
            constructor(dead_zone_=0)
            {
                this.deadZone = dead_zone_;
            }
            #SetDirection = function()
            {
                this.#left = this.#down = this.#right = this.#up = false;
                if (this.#polar.r > this.deadZone && (this.#polar.a>=13*Math.PI/8 || this.#polar.a<3*Math.PI/8)) this.#left = true;
                if (this.#polar.r > this.deadZone && this.#polar.a>=Math.PI/8 && this.#polar.a<7*Math.PI/8) this.#down = true;
                if (this.#polar.r > this.deadZone && this.#polar.a>=5*Math.PI/8 && this.#polar.a<11*Math.PI/8) this.#right = true;
                if (this.#polar.r > this.deadZone && this.#polar.a>=9*Math.PI/8 && this.#polar.a<15*Math.PI/8) this.#up = true;
            }
            get cartesian() { return this.#cartesian; }
            get polar() { return this.#polar; }
            get left() { return this.#left; }
            get down() { return this.#down; }
            get right() { return this.#right; }
            get up() { return this.#up; }
            set cartesian(cartesian_)
            {
                this.#cartesian = cartesian_;
                jge.math.CartesianToPolar(this.#cartesian, this.#polar);
                this.#SetDirection();
            }
            set polar(polar_)
            {
                this.#polar = polar_;
                jge.math.PolarToCartesian(this.#polar, this.#cartesian);
                this.#SetDirection();
            }
            IsOutOfDeadZone = function()
            {
                return this.#polar.r > this.deadZone;
            }
            Zero = function()
            {
                this.#left = this.#right = this.#down = this.#up = false;
                this.#cartesian.x = this.#cartesian.y = 0;
                jge.math.CartesianToPolar(this.#cartesian, this.#polar);
            }
            SetCartesian = function(x_, y_)
            {
                this.#cartesian.x = x_;
                this.#cartesian.y = y_;
                jge.math.CartesianToPolar(this.#cartesian, this.#polar);
                this.#SetDirection();
            }
            SetCartesianX = function(x_)
            {
                this.#cartesian.x = x_;
                jge.math.CartesianToPolar(this.#cartesian, this.#polar);
                this.#SetDirection();
            }
            SetCartesianY = function(y_)
            {
                this.#cartesian.y = y_;
                jge.math.CartesianToPolar(this.#cartesian, this.#polar);
                this.#SetDirection();
            }
            SetPolar = function(a_, r_)
            {
                this.#polar.a = a_;
                this.#polar.r = r_;
                jge.math.PolarToCartesian(this.#polar, this.#cartesian);
                this.#SetDirection();
            }
            SetPolarA = function(a_)
            {
                this.#polar.a = a_;
                jge.math.PolarToCartesian(this.#polar, this.#cartesian);
                this.#SetDirection();
            }
            SetPolarR = function(r_)
            {
                this.#polar.r = r_;
                jge.math.PolarToCartesian(this.#polar, this.#cartesian);
                this.#SetDirection();
            }
        },
        GAME_PAD: class
        {
            #index = -1;
            constructor(index_=0, buttons_=[], axes_=[])
            {
                index_=index_;
                this.joyStick = new jge.input.JOY_STICK();
                this.buttonA = new jge.input.BUTTON();
                this.buttonB = new jge.input.BUTTON();
                this.buttonX = new jge.input.BUTTON();
                this.buttonY = new jge.input.BUTTON();
                this.buttonStart = new jge.input.BUTTON();
                this.buttonSelect = new jge.input.BUTTON();
            }
            get index() { return index_;}
        }
    },
    RUN_FRAME_LOOP: class
    {
        constructor(on_start_, on_update_)
        {
            on_start_();
            this.evenframe = true;
            this.lastTimePoint = 0;
            this.timeStep = 1;
            self = this;
            const Loop = function(new_time_point_)
            {
                if (self.evenframe)
                {
                    let deltaTime = (new_time_point_-self.lastTimePoint)/1000;//s
                    self.lastTimePoint=new_time_point_;
                    self.timeStep += Math.min(deltaTime * 30, 1);
                    if (self.timeStep > 60) self.timeStep = 1;

                    on_update_(deltaTime, self.timeStep);
                }
                self.evenframe = !self.evenframe;
                window.requestAnimationFrame(Loop);
            }
            window.requestAnimationFrame(Loop);
        }
    },
    VECTOR: class
    {
        constructor(x_=0,y_=0,z_=0,w_=0)
        {
            this.vector = [x_,y_,z_,w_]
        }
        SubVector = function(vector_)
        {
            return new jge.VECTOR(this.vector[0]-vector_[0],this.vector[1]-vector_[1],this.vector[2]-vector_[2])
        }
        AddVector = function(vector_)
        {
            return new jge.VECTOR(this.vector[0]+vector_[0],this.vector[1]+vector_[1],this.vector[2]+vector_[2])
        }
        MulNumber = function(number_)
        {
            return new jge.VECTOR(this.vector[0]*number_,this.vector[1]*number_,this.vector[2]*number_)
        }
        MulMatrix = function(matrix_)
        {
            let v = [];
            for (let i = 0; i < 4; i++) v.push(this.vector[0]*matrix_[0][i]+this.vector[1]*matrix_[1][i]+this.vector[2]*matrix_[2][i]+matrix_[3][i]);
            if (v[3] != 0) { v[0]=v[0]/v[3]; v[1]=v[1]/v[3]; v[2]=v[2]/v[3]; }
            return new jge.VECTOR(v[0],v[1],v[2]);
        }
        DotProduct = function(vector_)
        {
            return this.vector[0]*vector_[0]+this.vector[1]*vector_[1]+this.vector[2]*vector_[2];
        }
        CrossProduct = function(vector_)
        {
            let v = new jge.VECTOR();
            v.vector[0] = this.vector[1] * vector_[2] - this.vector[2] * vector_[1];
            v.vector[1] = this.vector[2] * vector_[0] - this.vector[0] * vector_[2];
            v.vector[2] = this.vector[0] * vector_[1] - this.vector[1] * vector_[0];
            return v;
        }
        magnitude=function()
        {
            let sum = 0
            for (let i = 0; i < 4; i++) sum += this.vector[i]*this.vector[i]
            return Math.sqrt(sum);
        }
        Normalise = function()
        {
            let l = Math.sqrt(this.vector[0]*this.vector[0]+this.vector[1]*this.vector[1]+this.vector[2]*this.vector[2]);
            if (l != 0) return new jge.VECTOR(this.vector[0]/l,this.vector[1]/l,this.vector[2]/l)
            else return new jge.VECTOR();
        }
        Projection = function(vector_)
        {
            let b = new jge.VECTOR(vector_[0], vector_[1], vector_[2]);
            let a = b.DotProduct(this.vector);
            let c = b.magnitude();
            if (c != 0) return a / c;
            else return 0;
        }
    },
    MATRIX: class 
    {
        constructor(matrix_ = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]])
        {
            this.matrix = matrix_;
        }

        Inverse = function()
        {
            let m = new jge.MATRIX();
            for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) m.matrix[i][j] = this.matrix[j][i];
            for (let i = 0; i < 3; i++) m.matrix[3][i]=-(this.matrix[3][0]*m.matrix[0][i]+this.matrix[3][1]*m.matrix[1][i]+this.matrix[3][2]*m.matrix[2][i]);
            return m;
        }
        MulMatrix = function(matrix_)
        {
            let m = new jge.MATRIX([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
            for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) m.matrix[i][j]+=this.matrix[i][k]*matrix_[k][j];
            return m;
        }
        Orthonormalized = function()
        {
            let m = new jge.MATRIX();
            let z = (new jge.VECTOR(this.matrix[2][0],this.matrix[2][1],this.matrix[2][2])).Normalise();
            let x = (new jge.VECTOR(this.matrix[1][0],this.matrix[1][1],this.matrix[1][2])).CrossProduct(z.vector).Normalise();
            let y = z.CrossProduct(x.vector);
            m.matrix[0] = [x.vector[0],x.vector[1],x.vector[2],0];
            m.matrix[1] = [y.vector[0],y.vector[1],y.vector[2],0];
            m.matrix[2] = [z.vector[0],z.vector[1],z.vector[2],0];
            this.matrix = m.matrix;
        }
    },
    WIRE: class
    {
        constructor(point_one_, point_two_, color_)
        {
            this.pointOne = point_one_;
            this.pointTwo = point_two_;
            this.color = color_;
        }
        Clip = function(plane_point_, plane_normal_)
        {
            const GetLineIntersectPoint = function(plane_point_, plane_normal_, point_one_, point_two_)
            {
                let line = point_two_.SubVector(point_one_.vector);
                let d = plane_point_.DotProduct(plane_normal_.vector);
                let t = (d-plane_normal_.DotProduct(point_one_.vector))/plane_normal_.DotProduct(line.vector);
                return point_one_.AddVector(line.MulNumber(t).vector);
            }
            let planePointOne = plane_normal_.DotProduct(this.pointOne.SubVector(plane_point_.vector).vector);
            let planePointTwo = plane_normal_.DotProduct(this.pointTwo.SubVector(plane_point_.vector).vector);
            if (planePointOne > 0 && planePointTwo > 0) return false;
            if (planePointOne > 0 && planePointTwo <= 0)
            {
                this.pointTwo = GetLineIntersectPoint(plane_point_, plane_normal_, this.pointOne, this.pointTwo);
                return false;
            }
            if (planePointOne <= 0 && planePointTwo > 0)
            {
                this.pointOne = GetLineIntersectPoint(plane_point_, plane_normal_, this.pointTwo, this.pointOne);
                return false;
            }
            return true;
        }
    },
    RenderWireframe: function(ctx_, wirefram_, view_matrix_, projection_matrix_, z_near_)
    {
        for (let i = 0; i < wirefram_.length; i++)
        {
            let wire = wirefram_[i];
            let viewWirePointOne = wire.pointOne.MulMatrix(view_matrix_.matrix);
            let viewWirePointTwo = wire.pointTwo.MulMatrix(view_matrix_.matrix);
            let viewWire = new jge.WIRE(viewWirePointOne, viewWirePointTwo, wire.color);

            if (!viewWire.Clip(new jge.VECTOR(0,0,-z_near_),new jge.VECTOR(0,0,-1)))// break;
            {
                let projectionWirePointOne = viewWire.pointOne.MulMatrix(projection_matrix_.matrix);
                let projectionWirePointTwo = viewWire.pointTwo.MulMatrix(projection_matrix_.matrix);
                let projectionWire = new jge.WIRE(projectionWirePointOne, projectionWirePointTwo, viewWire.color);
                        
                if (!projectionWire.Clip(new jge.VECTOR(0,-ctx_.canvas.height/2,0),new jge.VECTOR(0,1,0)))// break;
                {
                    if (!projectionWire.Clip(new jge.VECTOR(0,ctx_.canvas.height/2,0),new jge.VECTOR(0,-1,0)))
                    {
                        if (!projectionWire.Clip(new jge.VECTOR(-ctx_.canvas.width/2,0,0),new jge.VECTOR(1,0,0)))
                        {
                            if (!projectionWire.Clip(new jge.VECTOR(ctx_.canvas.width/2,0,0),new jge.VECTOR(-1,0,0)))
                            {
                                let screenPointOne = [(projectionWire.pointOne.vector[0]+1)/2*ctx_.canvas.width, (projectionWire.pointOne.vector[1]+1)/2*ctx_.canvas.height];
                                let screenPointTwo = [(projectionWire.pointTwo.vector[0]+1)/2*ctx_.canvas.width, (projectionWire.pointTwo.vector[1]+1)/2*ctx_.canvas.height];
                                jge.DrawLine(ctx_, projectionWire.color, screenPointOne, screenPointTwo);                                        
                            }
                        }
                    }
                }
            }
        }
    },
    CreateRotationMatrix: function(angle_, vector_)
    {
        let m = new jge.MATRIX()
        m.matrix[0][0]=vector_[0]*vector_[0]+(1-vector_[0]*vector_[0])*Math.cos(angle_);
        m.matrix[0][1]=(1-Math.cos(angle_))*vector_[0]*vector_[1]-vector_[2]* Math.sin(angle_);
        m.matrix[0][2]=(1-Math.cos(angle_))*vector_[0]*vector_[2]+vector_[1]* Math.sin(angle_);
        m.matrix[1][0]=(1-Math.cos(angle_))*vector_[0]*vector_[1]+vector_[2]* Math.sin(angle_);
        m.matrix[1][1]=vector_[1]*vector_[1]+(1-vector_[1]*vector_[1])*Math.cos(angle_);
        m.matrix[1][2]=(1-Math.cos(angle_))*vector_[1]*vector_[2]-vector_[0]* Math.sin(angle_);
        m.matrix[2][0]=(1-Math.cos(angle_))*vector_[0]*vector_[2]-vector_[1]* Math.sin(angle_);
        m.matrix[2][1]=(1-Math.cos(angle_))*vector_[1]*vector_[2]+vector_[0]* Math.sin(angle_);
        m.matrix[2][2]=vector_[2]*vector_[2]+(1-vector_[2]*vector_[2])*Math.cos(angle_);
        return m;
    },
    CreateProjectionMatrix: function(screen_width_, screen_height_, f_o_v_, z_far_, z_near_)
    {
        let q = z_far_/(z_far_-z_near_);
        let a = screen_height_/screen_width_;
        let f = 1/Math.tan(f_o_v_/2);
        let m = new jge.MATRIX([[a*f,0,0,0],[0,f,0,0],[0,0,q,1],[0,0,-z_near_*q,0]]);
        return m;
    },
    SPRITE: class
    {
        constructor(sprite_sheet_, sprite_x_start_, sprite_y_start_, sprite_size_, theta_=0)
        {
            this.spriteSheet = sprite_sheet_;
            this.spriteXStart = sprite_x_start_;
            this.spriteYStart = sprite_y_start_;
            this.spriteSize = sprite_size_;
            this.theta = theta_;
        }

        Draw = function(ctx_, position_x_, position_y_, size_, theta_=0, image_smoothing_enabled_=false)
        {
            let theta = this.theta + theta_;
            let x = (Math.cos(theta) - Math.sin(theta))*size_/2;
            let y = (Math.sin(theta) + Math.cos(theta))*size_/2;
            ctx_.save();
            ctx_.imageSmoothingEnabled = image_smoothing_enabled_;
            ctx_.translate(position_x_-x, position_y_-y);
            ctx_.rotate(theta);
            ctx_.drawImage(this.spriteSheet, this.spriteXStart, this.spriteYStart, this.spriteSize, this.spriteSize, 0, 0, size_, size_);
            ctx_.restore();
        }
    },
    DrawSpriteFromSpriteSheet : function(ctx_, sprite_sheet_, sprite_x_start_, sprite_y_start_, sprite_size_, position_x_, position_y_, size_, theta_=0, image_smoothing_enabled_=false)
    {
        let x = (Math.cos(theta_) - Math.sin(theta_))*size_/2;
        let y = (Math.sin(theta_) + Math.cos(theta_))*size_/2;
        ctx_.save();
        ctx_.imageSmoothingEnabled = image_smoothing_enabled_;
        ctx_.translate(position_x_-x, position_y_-y);
        ctx_.rotate(theta_);
        ctx_.drawImage(sprite_sheet_, sprite_x_start_, sprite_y_start_, sprite_size_, sprite_size_, 0, 0, size_, size_);
        ctx_.restore();
    },
    ClearScreen: function(ctx_, color_)
    {
        ctx_.fillStyle = color_;
        ctx_.fillRect(0, 0, ctx_.canvas.width, ctx_.canvas.height);
    },
    DrawLine: function(ctx_, color_, vector_one_, vector_two_, line_width_=1)
    {
        ctx_.strokeStyle = color_;
        ctx_.lineWidth = line_width_;
        ctx_.beginPath();
        ctx_.moveTo(vector_one_[0], vector_one_[1]);
        ctx_.lineTo(vector_two_[0], vector_two_[1]);
        ctx_.stroke();
    },
    DrawCircle: function(ctx_, color_, vector_, radius_, line_width_=1)
    {
        ctx_.strokeStyle = color_;
        ctx_.lineWidth = line_width_;
        ctx_.beginPath();
        ctx_.arc(vector_[0], vector_[1], radius_, 0, 2 * Math.PI);
        ctx_.stroke();
    },
    FillCircle: function(ctx_, color_, vector_, radius_)
    {
        ctx_.fillStyle = color_;
        ctx_.beginPath();
        ctx_.arc(vector_[0], vector_[1], radius_, 0, 2 * Math.PI);
        ctx_.fill();
    }
}